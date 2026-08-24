class Analytics {
  constructor() {
    this.events = [];
    this.stats = {
      totalClicks: 0,
      totalUsers: 0,
      totalConversions: 0,
      clickThroughRate: 0,
      conversionRate: 0
    };
  }

  /**
   * Отслеживает клик по ссылке
   */
  trackClick(clickData) {
    const event = {
      type: 'click',
      userId: clickData.userId,
      clickType: clickData.type, // 'portal_link', 'answer_portal_link'
      timestamp: clickData.timestamp || new Date(),
      data: clickData
    };

    this.events.push(event);
    this.stats.totalClicks++;

    console.log(`📊 Click tracked: ${clickData.type} from user ${clickData.userId}`);
    return event;
  }

  /**
   * Отслеживает заполнение формы
   */
  trackFormCompletion(formData) {
    const event = {
      type: 'form_completed',
      userId: formData.userId,
      timestamp: new Date(),
      data: formData
    };

    this.events.push(event);
    console.log(`📋 Form completed for user ${formData.userId}`);
    return event;
  }

  /**
   * Отслеживает потенциальную конверсию (продажу)
   */
  trackConversion(conversionData) {
    const event = {
      type: 'conversion',
      userId: conversionData.userId,
      conversionValue: conversionData.value || 30, // €30 по умолчанию
      timestamp: new Date(),
      source: conversionData.source, // 'telegram', 'instagram', 'tiktok'
      data: conversionData
    };

    this.events.push(event);
    this.stats.totalConversions++;

    console.log(`💰 Conversion tracked: €${event.conversionValue} from user ${conversionData.userId}`);
    return event;
  }

  /**
   * Отслеживает пользовательское действие
   */
  trackUserAction(actionData) {
    const event = {
      type: 'user_action',
      userId: actionData.userId,
      action: actionData.action, // 'message', 'command', 'callback'
      timestamp: new Date(),
      data: actionData
    };

    this.events.push(event);
    console.log(`👤 User action tracked: ${actionData.action}`);
    return event;
  }

  /**
   * Получает статистику
   */
  getStats() {
    const conversionValue = this.events
      .filter(e => e.type === 'conversion')
      .reduce((sum, e) => sum + (e.conversionValue || 0), 0);

    const formCompletions = this.events.filter(e => e.type === 'form_completed').length;
    const uniqueUsers = new Set(this.events.map(e => e.userId)).size;

    return {
      totalEvents: this.events.length,
      totalClicks: this.stats.totalClicks,
      totalFormCompletions: formCompletions,
      totalConversions: this.stats.totalConversions,
      estimatedRevenue: `€${conversionValue}`,
      uniqueUsers: uniqueUsers,
      avgClicksPerUser: (this.stats.totalClicks / uniqueUsers).toFixed(2),
      conversionValue: conversionValue,
      clickThroughRate: this.calculateCTR(),
      conversionRate: this.calculateConversionRate()
    };
  }

  /**
   * Рассчитывает Click-Through Rate
   */
  calculateCTR() {
    const totalActions = this.events.length;
    if (totalActions === 0) return '0%';

    const ctr = (this.stats.totalClicks / totalActions * 100).toFixed(2);
    return `${ctr}%`;
  }

  /**
   * Рассчитывает коэффициент конверсии
   */
  calculateConversionRate() {
    if (this.stats.totalClicks === 0) return '0%';

    const conversionRate = (this.stats.totalConversions / this.stats.totalClicks * 100).toFixed(2);
    return `${conversionRate}%`;
  }

  /**
   * Получает события за период
   */
  getEventsByDateRange(startDate, endDate) {
    return this.events.filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= startDate && eventDate <= endDate;
    });
  }

  /**
   * Получает статистику по источникам
   */
  getStatsBySource() {
    const sourceStats = {};

    this.events
      .filter(e => e.type === 'conversion')
      .forEach(event => {
        const source = event.source || 'unknown';
        if (!sourceStats[source]) {
          sourceStats[source] = {
            conversions: 0,
            revenue: 0
          };
        }
        sourceStats[source].conversions++;
        sourceStats[source].revenue += event.conversionValue || 0;
      });

    return sourceStats;
  }

  /**
   * Получает события пользователя
   */
  getUserEvents(userId) {
    return this.events.filter(e => e.userId === userId);
  }

  /**
   * Получает лучшие контент-идеи по кликам
   */
  getTopContentByClicks() {
    const contentStats = {};

    this.events
      .filter(e => e.clickType)
      .forEach(event => {
        const content = event.data.contentId || 'unknown';
        if (!contentStats[content]) {
          contentStats[content] = 0;
        }
        contentStats[content]++;
      });

    return Object.entries(contentStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([content, clicks]) => ({ content, clicks }));
  }

  /**
   * Экспортирует данные в CSV
   */
  exportToCSV() {
    let csv = 'Type,UserId,Timestamp,Data\n';

    this.events.forEach(event => {
      const data = JSON.stringify(event.data || '').replace(/"/g, '""');
      csv += `"${event.type}","${event.userId}","${event.timestamp}","${data}"\n`;
    });

    return csv;
  }

  /**
   * Очищает старые события
   */
  clearOldEvents(daysToKeep = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const beforeCount = this.events.length;
    this.events = this.events.filter(e => new Date(e.timestamp) > cutoffDate);
    const afterCount = this.events.length;

    console.log(`🗑️ Cleared ${beforeCount - afterCount} old events`);
  }

  /**
   * Получает дневной отчет
   */
  getDailyReport() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayEvents = this.getEventsByDateRange(today, tomorrow);

    return {
      date: today.toISOString().split('T')[0],
      totalEvents: todayEvents.length,
      clicks: todayEvents.filter(e => e.type === 'click').length,
      formCompletions: todayEvents.filter(e => e.type === 'form_completed').length,
      conversions: todayEvents.filter(e => e.type === 'conversion').length,
      revenue: todayEvents
        .filter(e => e.type === 'conversion')
        .reduce((sum, e) => sum + (e.conversionValue || 0), 0),
      uniqueUsers: new Set(todayEvents.map(e => e.userId)).size
    };
  }

  /**
   * Получает еженедельный отчет
   */
  getWeeklyReport() {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weekEvents = this.getEventsByDateRange(weekAgo, today);

    return {
      period: `${weekAgo.toISOString().split('T')[0]} to ${today.toISOString().split('T')[0]}`,
      totalEvents: weekEvents.length,
      clicks: weekEvents.filter(e => e.type === 'click').length,
      formCompletions: weekEvents.filter(e => e.type === 'form_completed').length,
      conversions: weekEvents.filter(e => e.type === 'conversion').length,
      revenue: weekEvents
        .filter(e => e.type === 'conversion')
        .reduce((sum, e) => sum + (e.conversionValue || 0), 0),
      uniqueUsers: new Set(weekEvents.map(e => e.userId)).size,
      avgRevenuePerUser: (weekEvents
        .filter(e => e.type === 'conversion')
        .reduce((sum, e) => sum + (e.conversionValue || 0), 0) / new Set(weekEvents.map(e => e.userId)).size
      ).toFixed(2)
    };
  }
}

module.exports = Analytics;
