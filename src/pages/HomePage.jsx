import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plug, HelpCircle, HeadphonesIcon, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { isAdmin } from '@/config/admin';
import ServerStatus from '@/components/ServerStatus';

const HomePage = () => {
  const { user } = useAuth();
  const { faqs } = useData();

  // Get top 3 most important FAQs for homepage preview
  const featuredFAQs = faqs
    .filter(faq => ['Getting Started', 'Sessions', 'Security'].includes(faq.category))
    .slice(0, 3);

  const accessAdminPanel = () => {
    if (user && isAdmin(user)) {
      window.location.href = '/?manji=admin';
    } else if (user) {
      toast.error(`Access denied. You don't have admin privileges.`);
    } else {
      toast.error('Please login first to access admin panel.');
      // Could trigger login here if needed
    }
  };
  const navigationOptions = [
    {
      id: 'session',
      icon: MessageSquare,
      title: 'Session',
      description: 'Connect your WhatsApp with QR code or pairing code',
      path: '/session',
    },
    {
      id: 'plugins',
      icon: Plug,
      title: 'Plugins',
      description: 'Browse and manage plugins to extend bot functionality',
      path: '/plugins',
    },
    {
      id: 'faq',
      icon: HelpCircle,
      title: 'FAQ',
      description: 'Find answers to frequently asked questions',
      path: '/faq',
    },
    {
      id: 'support',
      icon: HeadphonesIcon,
      title: 'Support',
      description: 'Get help and contact our support team',
      path: '/support',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Server Status Indicator */}
        <div className="max-w-md mx-auto mb-8">
          <ServerStatus showDetails={true} />
        </div>

        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-6">
            <span className="text-sm font-medium text-primary px-3 py-1">Vinsmoke Bot Manager</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Manage Your WhatsApp Bot
            <span className="block text-primary mt-2">Like a Pro</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Complete control panel for your Vinsmoke WhatsApp bot with session management, plugin ecosystem, and powerful customization options.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {navigationOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Link key={option.id} to={option.path}>
                <Card className="border-border hover:shadow-lg transition-all duration-300 card-hover cursor-pointer group">
                
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors duration-300">
                    {option.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Admin Access Button (only for admins) */}
        {user && isAdmin(user) && (
          <div className="text-center mt-12">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2 text-primary">Admin Access</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Welcome, {user.name || user.login}! You have admin privileges.
              </p>
              <Button 
                onClick={accessAdminPanel} 
                className="w-full bg-primary hover:bg-primary-hover"
              >
                <Shield className="w-4 h-4 mr-2" />
                Open Admin Panel
              </Button>
            </div>
          </div>
        )}

        {/* Quick FAQ Section */}
        {featuredFAQs.length > 0 && (
          <section className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Quick Help</h2>
              <p className="text-lg text-muted-foreground">
                Get started quickly with these common questions
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {featuredFAQs.map((faq) => (
                <Card key={faq.id} className="border-border hover:shadow-md transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                        {faq.category}
                      </span>
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                      {faq.answer.replace(/\n/g, ' ').substring(0, 120)}...
                    </p>
                    <Link 
                      to="/faq" 
                      className="inline-flex items-center text-primary hover:text-primary-hover text-sm font-medium"
                    >
                      Read more
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link to="/faq">
                <Button variant="outline" size="lg">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  View All FAQs
                </Button>
              </Link>
            </div>
          </section>
        )}
      </section>
    </div>
  );
};

export default HomePage;