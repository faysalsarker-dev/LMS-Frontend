export interface DashboardData {
  success: boolean;
  message: string;
  data: {
    users: {
      total: number;
      roles: {
        students: number;
        instructors: number;
        admins: number;
        superAdmins: number;
      };
      status: {
        active: number;
        inactive: number;
        verified: number;
        unverified: number;
      };
      newThisMonth: number;
      topInstructors: any[];
    };
    courses: {
      total: number;
      status: {
        draft: number;
        published: number;
        archived: number;
      };
      levels: {
        beginner: number;
        intermediate: number;
        advanced: number;
      };
      totalEnrollments: number;
      averageRating: string;
      totalRatedCourses: number;
      featured: number;
      withDiscount: number;
      certificateOffering: number;
      topRated: Course[];
    };
    enrollments: {
      total: number;
      status: {
        active: number;
        completed: number;
        cancelled: number;
      };
      payment: {
        paid: number;
        pending: number;
        failed: number;
      };
      paymentMethods: {
        alipay: number;
        wechat: number;
      };
      thisMonth: number;
      completionRate: string;
    };
    revenue: {
      totalRevenue: number;
      totalTransactions: number;
      averageOrderValue: number;
      monthlyRevenue: number;
      currency: string;
    };
    popularCourses: PopularCourse[];
    recentEnrollments: Enrollment[];
    timestamp: string;
  };
  meta: null;
}

export interface Course {
  _id: string;
  title: string;
  price: number;
  averageRating: number;
  totalEnrolled: number;
}

export interface PopularCourse extends Course {
  slug: string;
  thumbnail: string;
}

export interface Enrollment {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    profile: string | null;
  };
  course: {
    _id: string;
    title: string;
    slug: string;
    thumbnail: string;
    price: number;
  };
  status: string;
  paymentStatus: string;
  method: string;
  enrolledAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
