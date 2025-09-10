import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HelpCircle, Building } from 'lucide-react';

const Contact = () => {
  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: "Email Us",
      description: "Send us an email and we'll respond within 24 hours",
      contact: "support@eduplatform.com",
      action: "mailto:support@eduplatform.com"
    },
    {
      icon: <Phone className="h-6 w-6 text-secondary" />,
      title: "Call Us",
      description: "Speak directly with our support team",
      contact: "+1 (555) 123-4567",
      action: "tel:+15551234567"
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-info" />,
      title: "Live Chat",
      description: "Chat with us in real-time for instant support",
      contact: "Available 24/7",
      action: "#"
    }
  ];

  const offices = [
    {
      city: "San Francisco",
      address: "123 Tech Street, Suite 456",
      zipCode: "San Francisco, CA 94105",
      phone: "+1 (555) 123-4567"
    },
    {
      city: "New York",
      address: "789 Education Ave, Floor 12",
      zipCode: "New York, NY 10001", 
      phone: "+1 (555) 987-6543"
    },
    {
      city: "London",
      address: "456 Learning Lane",
      zipCode: "London, UK SW1A 1AA",
      phone: "+44 20 1234 5678"
    }
  ];

  const faqs = [
    {
      question: "How do I enroll in a course?",
      answer: "Simply browse our course catalog, select a course, and click 'Enroll Now'. You can pay securely online and start learning immediately."
    },
    {
      question: "Can I get a refund?",
      answer: "Yes! We offer a 30-day money-back guarantee for all courses. If you're not satisfied, contact us for a full refund."
    },
    {
      question: "Do I get a certificate?",
      answer: "Yes, you'll receive a certificate of completion for every course you finish. These are industry-recognized credentials."
    },
    {
      question: "Can I learn at my own pace?",
      answer: "Absolutely! All our courses are self-paced, so you can learn whenever and wherever is convenient for you."
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We're here to help! Reach out to us with any questions, feedback, or support needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing Question</SelectItem>
                      <SelectItem value="course">Course Content</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us how we can help you..." 
                    className="min-h-32"
                  />
                </div>
                
                <Button className="w-full bg-gradient-primary">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                
                <p className="text-sm text-muted-foreground">
                  * Required fields. We'll get back to you within 24 hours.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Methods & Info */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => (
                  <a
                    key={index}
                    href={method.action}
                    className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {method.icon}
                      <div>
                        <div className="font-semibold">{method.title}</div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {method.description}
                        </div>
                        <div className="text-sm font-medium text-primary">
                          {method.contact}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Support Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Emergency support available 24/7 for critical issues
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Office Locations */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Offices</h2>
            <p className="text-muted-foreground text-lg">
              Visit us at one of our global locations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {offices.map((office, index) => (
              <Card key={index} className="text-center hover-lift animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Building className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{office.city}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{office.address}</span>
                    </div>
                    <div>{office.zipCode}</div>
                    <div className="flex items-center justify-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{office.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg">
              Quick answers to common questions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <HelpCircle className="h-5 w-5 text-primary mt-0.5" />
                    <h3 className="font-semibold">{faq.question}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed ml-8">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;