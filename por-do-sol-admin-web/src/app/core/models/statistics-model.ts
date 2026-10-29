export interface StatisticsResponse {
  revenueByKiosk: { 
    dates: string[], 
    kiosks: { 
      kioskId: number, 
      kioskName: string, 
      revenue: number[] 
    }[] 
  }

  topProducts: { 
    products: { 
      productId: number, 
      productName: string, 
      unitsSold: number 
    }[] 
  }

  dailyRevenue: { 
    points: { 
      date: string, 
      value: number 
    }[] 
  }

  ordersByCategory: { 
    categories: { 
      categoryId: number, 
      categoryName: string, 
      orderCount: number 
    }[] 
  }

  cancellations: { 
    cancelledOrders: number, 
    totalOrders: number, 
    rate: number }
}
