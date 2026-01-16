/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetTopTestimonialsQuery } from "@/redux/features/testimonial/testimonial.api";
import { Marquee } from "../magicui/marquee";
import TestimonialCard from "./TestimonialCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

const Testimonial = () => {
  const { t } = useTranslation();

  const { data, isLoading, isError } = useGetTopTestimonialsQuery({});
  const testimonials = data?.data || [];

  // Split testimonials into two lines
  const midIndex = Math.ceil(testimonials.length / 2);
  const firstLine = testimonials.slice(0, midIndex);
  const secondLine = testimonials.slice(midIndex);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {t('home.testimonial.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                      {t('home.testimonial.description')}

          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          {/* Loading State */}
          {isLoading && (
            <div className="w-full space-y-4">
              <div className="flex gap-4 overflow-hidden px-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 w-64 rounded-2xl" />
                ))}
              </div>
              <div className="flex gap-4 overflow-hidden px-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 w-64 rounded-2xl" />
                ))}
              </div>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-10 text-destructive">
              Something went wrong while loading testimonials 😢
            </div>
          )}

          {/* Success State */}
          {!isLoading && !isError && testimonials.length > 0 && (
            <>
              <Marquee pauseOnHover className="[--duration:20s] w-full px-2">
                {firstLine.map((item: any) => (
                  <TestimonialCard key={item._id} testimonial={item} />
                ))}
              </Marquee>

              <Marquee
                pauseOnHover
                reverse
                className="[--duration:20s] w-full px-2"
              >
                {secondLine.map((item: any) => (
                  <TestimonialCard key={item._id} testimonial={item} />
                ))}
              </Marquee>
            </>
          )}

          {/* No Testimonials */}
          {!isLoading && !isError && testimonials.length === 0 && (
            <p className="text-center text-muted-foreground py-10">
              No testimonials found yet.
            </p>
          )}

          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/12 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/12 bg-gradient-to-l from-background"></div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
