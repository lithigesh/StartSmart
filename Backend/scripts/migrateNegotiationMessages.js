/**
 * Migration script to convert existing negotiationHistory arrays
 * to the new NegotiationMessage model.
 * 
 * This script:
 * 1. Reads all FundingRequests with negotiationHistory
 * 2. Creates NegotiationMessage documents for each message
 * 3. Preserves original data for rollback capability
 * 4. Is idempotent - can be run multiple times safely
 * 
 * Usage: node scripts/migrateNegotiationMessages.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const FundingRequest = require('../models/FundingRequest.model');
const NegotiationMessage = require('../models/NegotiationMessage.model');
const User = require('../models/User.model');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB Connected');
  } catch (error) {
    console.error('✗ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

const migrateMessages = async () => {
  try {
    console.log('\n📦 Starting migration of negotiation messages...\n');

    // Find all funding requests with negotiation history
    const fundingRequests = await FundingRequest.find({
      negotiationHistory: { $exists: true, $ne: [] },
    }).populate('entrepreneur', 'name email');

    console.log(`Found ${fundingRequests.length} funding requests with messages\n`);

    let totalMessagesProcessed = 0;
    let totalMessagesCreated = 0;
    let totalMessagesSkipped = 0;
    let totalErrors = 0;

    for (const fundingRequest of fundingRequests) {
      try {
        console.log(`\n📋 Processing Funding Request: ${fundingRequest._id}`);
        console.log(`   Messages in history: ${fundingRequest.negotiationHistory.length}`);

        for (const historyEntry of fundingRequest.negotiationHistory) {
          totalMessagesProcessed++;

          // Determine sender and sender role
          let sender;
          let senderRole;

          if (historyEntry.investor) {
            // Message from investor
            sender = historyEntry.investor;
            senderRole = 'investor';
          } else {
            // Message from entrepreneur (investor field is null)
            sender = fundingRequest.entrepreneur._id;
            senderRole = 'entrepreneur';
          }

          // Check if message already migrated (idempotent check)
          const existingMessage = await NegotiationMessage.findOne({
            fundingRequest: fundingRequest._id,
            sender: sender,
            content: historyEntry.message,
            createdAt: historyEntry.timestamp,
          });

          if (existingMessage) {
            console.log(`   ⏭️  Skipping duplicate message from ${new Date(historyEntry.timestamp).toISOString()}`);
            totalMessagesSkipped++;
            continue;
          }

          // Create new NegotiationMessage
          const newMessage = new NegotiationMessage({
            fundingRequest: fundingRequest._id,
            sender: sender,
            senderRole: senderRole,
            messageType: 'text',
            content: historyEntry.message,
            status: 'delivered', // Old messages are considered delivered
            createdAt: historyEntry.timestamp,
            updatedAt: historyEntry.timestamp,
          });

          await newMessage.save();
          totalMessagesCreated++;
          console.log(`   ✓ Created message from ${senderRole} at ${new Date(historyEntry.timestamp).toISOString()}`);
        }

        console.log(`   ✓ Completed migration for request ${fundingRequest._id}`);
      } catch (error) {
        totalErrors++;
        console.error(`   ✗ Error processing request ${fundingRequest._id}:`, error.message);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary:');
    console.log('='.repeat(60));
    console.log(`Total messages processed:  ${totalMessagesProcessed}`);
    console.log(`Messages created:          ${totalMessagesCreated}`);
    console.log(`Messages skipped:          ${totalMessagesSkipped}`);
    console.log(`Errors encountered:        ${totalErrors}`);
    console.log('='.repeat(60));

    if (totalErrors === 0) {
      console.log('\n✅ Migration completed successfully!\n');
    } else {
      console.log('\n⚠️  Migration completed with some errors. Please review above.\n');
    }

    // Show sample of migrated messages
    const sampleCount = await NegotiationMessage.countDocuments();
    console.log(`\n📈 Total NegotiationMessage documents in database: ${sampleCount}`);

  } catch (error) {
    console.error('\n✗ Migration failed:', error.message);
    throw error;
  }
};

const rollback = async () => {
  console.log('\n⚠️  Rolling back migration...\n');
  
  const result = await NegotiationMessage.deleteMany({});
  console.log(`✓ Deleted ${result.deletedCount} NegotiationMessage documents`);
  console.log('\n✅ Rollback completed. Original negotiationHistory arrays remain intact.\n');
};

// Main execution
const main = async () => {
  await connectDB();

  const args = process.argv.slice(2);
  
  if (args.includes('--rollback')) {
    await rollback();
  } else if (args.includes('--help')) {
    console.log(`
Migration Script for Negotiation Messages
==========================================

Usage:
  node scripts/migrateNegotiationMessages.js [options]

Options:
  --help      Show this help message
  --rollback  Delete all NegotiationMessage documents (rollback migration)
  --dry-run   Show what would be migrated without making changes (TODO)

Examples:
  node scripts/migrateNegotiationMessages.js              # Run migration
  node scripts/migrateNegotiationMessages.js --rollback   # Rollback migration
    `);
  } else {
    await migrateMessages();
  }

  await mongoose.connection.close();
  console.log('✓ Database connection closed\n');
};

// Run the migration
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
