import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Star, Users, Clock, Grid, List } from 'lucide-react';
import { mockCourses, mockCategories } from '@/data/mockData';

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort courses
  const filteredCourses = mockCourses
    .filter(course => 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(course => selectedCategory === 'all' || course.category === selectedCategory)
    .filter(course => selectedLevel === 'all' || course.level === selectedLevel)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id.localeCompare(a.id);
        default: // popularity
          return b.students - a.students;
      }
    });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">All Courses</h1>
          <p className="text-muted-foreground text-lg">
            Choose from thousands of courses designed to help you reach your goals
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {mockCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex ml-auto">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Course Grid/List */}
        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
          {filteredCourses.map((course, index) => (
            <Card 
              key={course.id} 
              className={`course-card animate-fade-in ${viewMode === 'list' ? 'flex-row overflow-hidden' : ''}`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="aspect-video bg-gradient-card rounded-t-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary/60">{course.category.charAt(0)}</span>
                    </div>
                    {course.originalPrice && (
                      <Badge className="absolute top-3 left-3 bg-destructive">
                        {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                    {course.featured && (
                      <Badge className="absolute top-3 right-3 bg-secondary">
                        Bestseller
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{course.category}</Badge>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
                    <p className="text-sm text-muted-foreground mb-4">By {course.instructor}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.students.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className={`h-4 w-4 ${star <= course.rating ? 'fill-current text-secondary' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{course.rating}</span>
                      </div>
                      <div className="text-right">
                        {course.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            ${course.originalPrice}
                          </div>
                        )}
                        <div className="font-bold text-lg">${course.price}</div>
                      </div>
                    </div>
                    
                    <Link to={`/courses/${course.id}`} className="block">
                      <Button className="w-full">
                        View Course
                      </Button>
                    </Link>
                  </CardContent>
                </>
              ) : (
                <div className="flex w-full">
                  <div className="w-48 bg-gradient-card relative overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary/60">{course.category.charAt(0)}</span>
                    </div>
                    {course.originalPrice && (
                      <Badge className="absolute top-2 left-2 bg-destructive text-xs">
                        {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{course.category}</Badge>
                        <Badge variant="outline">{course.level}</Badge>
                        {course.featured && <Badge className="bg-secondary">Bestseller</Badge>}
                      </div>
                      <div className="text-right">
                        {course.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            ${course.originalPrice}
                          </div>
                        )}
                        <div className="font-bold text-lg">${course.price}</div>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                    <p className="text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                    <p className="text-sm text-muted-foreground mb-3">By {course.instructor}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.students.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current text-secondary" />
                          {course.rating}
                        </div>
                      </div>
                      
                      <Link to={`/courses/${course.id}`}>
                        <Button>View Course</Button>
                      </Link>
                    </div>
                  </CardContent>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <div className="mb-4 text-6xl">📚</div>
            <h3 className="text-2xl font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria or browse all courses
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedLevel('all');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;