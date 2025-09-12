
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
const TestimonialCard = () => {
    return (
       <Card className={`p-6 animate-fade-in w-80 `}>
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} className="h-4 w-4 fill-current text-secondary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"I went from complete beginner to landing my dream job in just 6 months. The practical projects really made the difference."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold">
                      {/* {testimonial.name.charAt(0)} */}M
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">Michael Chen</div>
                    <div className="text-sm text-muted-foreground">Data Scientist at Microsoft</div>
                  </div>
                </div>
              </Card>
    );
};

export default TestimonialCard;