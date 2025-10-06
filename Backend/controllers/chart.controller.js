// Backend chart controller for idea analytics
const Idea = require('../models/Idea.model');

// Get aggregated chart data for ideas overview
const getIdeasChartData = async (req, res) => {
  try {
    const userId = req.user.id;
    const ideas = await Idea.find({ owner: userId });

    // Category aggregation
    const categoryStats = ideas.reduce((acc, idea) => {
      const category = idea.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = {
          category,
          count: 0,
          totalLikes: 0,
          totalViews: 0
        };
      }
      acc[category].count += 1;
      acc[category].totalLikes += idea.likes || 0;
      acc[category].totalViews += idea.views || 0;
      return acc;
    }, {});

    const categoryData = Object.values(categoryStats);

    // Status distribution
    const statusStats = ideas.reduce((acc, idea) => {
      const status = idea.status || 'Draft';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statusData = Object.keys(statusStats).map(status => ({
      status,
      count: statusStats[status]
    }));

    // Monthly trend data (last 6 months)
    const monthlyData = {};
    const currentDate = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      monthlyData[monthKey] = { month: monthKey, ideas: 0, likes: 0, views: 0 };
    }

    // Aggregate ideas by month
    ideas.forEach(idea => {
      const ideaDate = new Date(idea.createdAt);
      const monthKey = ideaDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].ideas += 1;
        monthlyData[monthKey].likes += idea.likes || 0;
        monthlyData[monthKey].views += idea.views || 0;
      }
    });

    const monthlyTrends = Object.values(monthlyData);

    res.json({
      success: true,
      data: {
        categoryData,
        statusData,
        monthlyTrends,
        totalIdeas: ideas.length,
        totalLikes: ideas.reduce((sum, idea) => sum + (idea.likes || 0), 0),
        totalViews: ideas.reduce((sum, idea) => sum + (idea.views || 0), 0)
      }
    });
  } catch (error) {
    console.error('Error fetching ideas chart data:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching chart data',
      // Fallback mock data
      data: {
        categoryData: [
          { category: 'Technology', count: 3, totalLikes: 25, totalViews: 150 },
          { category: 'Healthcare', count: 2, totalLikes: 18, totalViews: 89 },
          { category: 'Finance', count: 1, totalLikes: 12, totalViews: 67 }
        ],
        statusData: [
          { status: 'Active', count: 4 },
          { status: 'Draft', count: 2 }
        ],
        monthlyTrends: [
          { month: 'Aug 2025', ideas: 2, likes: 15, views: 89 },
          { month: 'Sep 2025', ideas: 3, likes: 22, views: 134 },
          { month: 'Oct 2025', ideas: 1, likes: 8, views: 43 }
        ],
        totalIdeas: 6,
        totalLikes: 45,
        totalViews: 266
      }
    });
  }
};

// Get individual idea analytics data
const getIdeaAnalytics = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const userId = req.user.id;
    
    const idea = await Idea.findOne({ _id: ideaId, owner: userId });
    
    if (!idea) {
      return res.status(404).json({ success: false, message: 'Idea not found' });
    }

    // Generate mock time-series data for popularity trend
    // In a real app, you'd store this data over time
    const today = new Date();
    const trendData = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Mock data - in real app, fetch from analytics collection
      const views = Math.floor(Math.random() * 10) + (idea.views || 0) / 30;
      const likes = Math.floor(Math.random() * 3) + (idea.likes || 0) / 30;
      
      trendData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: Math.floor(views),
        likes: Math.floor(likes),
        engagement: Math.floor((views + likes * 2) / 2)
      });
    }

    // Performance metrics
    const performanceData = [
      { metric: 'Views', value: idea.views || 0, benchmark: 50 },
      { metric: 'Likes', value: idea.likes || 0, benchmark: 15 },
      { metric: 'Engagement', value: ((idea.likes || 0) / Math.max(idea.views || 1, 1)) * 100, benchmark: 25 },
      { metric: 'Score', value: idea.analysis?.score || 0, benchmark: 70 }
    ];

    res.json({
      success: true,
      data: {
        idea: {
          id: idea._id,
          title: idea.title,
          category: idea.category,
          views: idea.views || 0,
          likes: idea.likes || 0
        },
        trendData,
        performanceData,
        summary: {
          totalViews: idea.views || 0,
          totalLikes: idea.likes || 0,
          averageEngagement: ((idea.likes || 0) / Math.max(idea.views || 1, 1)) * 100,
          categoryRank: Math.floor(Math.random() * 10) + 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching idea analytics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching idea analytics' 
    });
  }
};

module.exports = {
  getIdeasChartData,
  getIdeaAnalytics
};
