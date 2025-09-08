// services/notification.service.js
const mongoose = require('mongoose');
const Notification = require('../models/Notification.model');
const User = require('../models/User.model');

class NotificationService {
    // Create notification for new idea submission (notify investors)
    static async createNewIdeaNotification(idea, entrepreneur) {
        try {
            // Get all investors to notify them about new ideas
            const investors = await User.find({ role: 'investor' });

            const notifications = investors.map(investor => ({
                user: investor._id,
                title: 'New Startup Idea Available',
                message: `New startup idea "${idea.title}" by ${entrepreneur.name} is now available for review`,
                type: 'new_idea',
                relatedIdea: idea._id,
                relatedUser: entrepreneur._id,
                actionUrl: `/idea/${idea._id}`,
                priority: 'medium'
            }));

            await Notification.insertMany(notifications);
            console.log(`Created ${notifications.length} new idea notifications for investors`);

            // Also notify the entrepreneur that their idea was submitted
            await Notification.create({
                user: entrepreneur._id,
                title: 'Idea Submitted Successfully',
                message: `Your idea "${idea.title}" has been submitted and will be reviewed soon. You'll be notified once analysis is complete.`,
                type: 'system',
                relatedIdea: idea._id,
                actionUrl: `/entrepreneur/ideas/${idea._id}`,
                priority: 'high'
            });

        } catch (error) {
            console.error('Error creating new idea notifications:', error);
        }
    }

    // Create welcome notification for new users
    static async createWelcomeNotification(user) {
        try {
            let title, message, actionUrl;
            
            if (user.role === 'investor') {
                title = 'Welcome to StartSmart - Investor Dashboard';
                message = 'Welcome! Start exploring innovative startup ideas and connect with entrepreneurs. Your investment journey begins here.';
                actionUrl = '/investor/dashboard';
            } else if (user.role === 'entrepreneur') {
                title = 'Welcome to StartSmart - Entrepreneur Dashboard';
                message = 'Welcome! Ready to pitch your startup idea? Create your first idea and get it analyzed by our AI system.';
                actionUrl = '/entrepreneur/dashboard';
            } else {
                title = 'Welcome to StartSmart';
                message = 'Welcome to the StartSmart platform! Explore the features available to you.';
                actionUrl = '/dashboard';
            }

            await Notification.create({
                user: user._id,
                title,
                message,
                type: 'system',
                priority: 'high',
                actionUrl
            });

            console.log(`Created welcome notification for user: ${user.email}`);
        } catch (error) {
            console.error('Error creating welcome notification:', error);
        }
    }

    // Create notification when investor shows interest in an idea
    static async createInvestorInterestNotification(investorId, ideaId, entrepreneurId, ideaTitle) {
        try {
            const investor = await User.findById(investorId);
            
            // Notify the entrepreneur that an investor is interested
            await Notification.create({
                user: entrepreneurId,
                title: 'Investor Interest in Your Idea',
                message: `${investor.name} has shown interest in your idea "${ideaTitle}". This could be a great opportunity to connect!`,
                type: 'interest_confirmation',
                relatedIdea: ideaId,
                relatedUser: investorId,
                actionUrl: `/entrepreneur/ideas/${ideaId}`,
                priority: 'high'
            });

            // Notify the investor about their interest confirmation
            await Notification.create({
                user: investorId,
                title: 'Interest Marked Successfully',
                message: `You've successfully marked interest in "${ideaTitle}". The entrepreneur has been notified and may reach out to you.`,
                type: 'interest_confirmation',
                relatedIdea: ideaId,
                relatedUser: entrepreneurId,
                actionUrl: `/investor/ideas/${ideaId}`,
                priority: 'medium'
            });

            console.log(`Created interest notifications for investor ${investorId} and entrepreneur ${entrepreneurId}`);
        } catch (error) {
            console.error('Error creating investor interest notifications:', error);
            throw error;
        }
    }

    // Create system notification for specific user
    static async createSystemNotification(userId, title, message, options = {}) {
        try {
            await Notification.create({
                user: userId,
                title,
                message,
                type: options.type || 'system',
                priority: options.priority || 'medium',
                actionUrl: options.actionUrl,
                relatedIdea: options.relatedIdea,
                relatedUser: options.relatedUser,
                expiresAt: options.expiresAt
            });

            console.log(`Created system notification for user: ${userId}`);
        } catch (error) {
            console.error('Error creating system notification:', error);
        }
    }
}

module.exports = NotificationService;
