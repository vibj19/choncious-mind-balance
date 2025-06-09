
import React, { useState, useEffect } from 'react';
import { Clock, Shield, Heart, Settings, BarChart3, Users, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [stats, setStats] = useState({
    totalTime: 0,
    sessionsToday: 0,
    pagesVisited: 0,
    averageSession: 0
  });

  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false);

  useEffect(() => {
    // Check if this is running as extension or web app
    if (typeof chrome !== 'undefined' && chrome.storage) {
      setIsExtensionInstalled(true);
      loadExtensionData();
    }
  }, []);

  const loadExtensionData = async () => {
    try {
      const result = await chrome.storage.local.get(['dailyStats']);
      if (result.dailyStats) {
        setStats(result.dailyStats);
      }
    } catch (error) {
      console.log('Not running as extension');
    }
  };

  const features = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Smart Time Tracking",
      description: "Monitor time spent on health websites with gentle, non-judgmental tracking"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Mindful Nudges",
      description: "Receive compassionate reminders to take breaks and practice self-care"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Wellness Resources",
      description: "Quick access to professional mental health support and meditation tools"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Customizable Limits",
      description: "Set your own thresholds and block specific sites that trigger anxiety"
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      text: "Choncious helped me break my cycle of endless health searches. The gentle reminders made all the difference."
    },
    {
      name: "Mike R.",
      text: "Finally, a tool that understands health anxiety. The breathing exercises are a game-changer."
    },
    {
      name: "Dr. Jennifer L.",
      text: "I recommend Choncious to my patients dealing with cyberchondria. It's compassionate and effective."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="text-4xl">🧘‍♀️</span>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Choncious
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A mindful Chrome extension designed to help you manage cyberchondria and health anxiety 
            with gentle guidance and professional resources
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              <Shield className="w-5 h-5 mr-2" />
              Install Extension
            </Button>
            <Button variant="outline" size="lg">
              <Users className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>
        </div>

        {/* Stats Dashboard - Only show if extension is installed */}
        {isExtensionInstalled && (
          <Card className="mb-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
            <CardHeader>
              <CardTitle className="text-white">Today's Mindful Browsing</CardTitle>
              <CardDescription className="text-indigo-100">
                Your journey to healthier digital habits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{Math.floor(stats.totalTime / 60)}m</div>
                  <div className="text-sm text-indigo-100">Time Today</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.sessionsToday}</div>
                  <div className="text-sm text-indigo-100">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{stats.pagesVisited}</div>
                  <div className="text-sm text-indigo-100">Pages Visited</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{Math.floor(stats.averageSession / 60)}m</div>
                  <div className="text-sm text-indigo-100">Avg Session</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-white/20 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabbed Content */}
        <div className="max-w-4xl mx-auto mb-16">
          <Tabs defaultValue="how-it-works" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
              <TabsTrigger value="resources">Wellness Resources</TabsTrigger>
              <TabsTrigger value="testimonials">Success Stories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="how-it-works" className="mt-6">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    How Choncious Helps You
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">1</div>
                    <div>
                      <h4 className="font-semibold mb-2">Gentle Monitoring</h4>
                      <p className="text-muted-foreground">Choncious quietly tracks your time on health websites without judgment, helping you become aware of your browsing patterns.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm">2</div>
                    <div>
                      <h4 className="font-semibold mb-2">Mindful Interventions</h4>
                      <p className="text-muted-foreground">When you've spent significant time researching symptoms, receive compassionate reminders to take a break and practice self-care.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-sm">3</div>
                    <div>
                      <h4 className="font-semibold mb-2">Professional Support</h4>
                      <p className="text-muted-foreground">Access direct links to professional therapy and meditation resources when you need extra support for your health anxiety.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="resources" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-green-600">💚 BetterHelp</CardTitle>
                    <CardDescription>Professional therapy for health anxiety</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect with licensed therapists who specialize in health anxiety and cyberchondria. Get personalized support and coping strategies.
                    </p>
                    <Button className="w-full" variant="outline">
                      <Heart className="w-4 h-4 mr-2" />
                      Get Professional Help
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-blue-600">🧠 Headspace</CardTitle>
                    <CardDescription>Meditation and mindfulness tools</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Access guided meditations specifically designed for anxiety management and building a healthier relationship with worry.
                    </p>
                    <Button className="w-full" variant="outline">
                      <Clock className="w-4 h-4 mr-2" />
                      Start Meditating
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="testimonials" className="mt-6">
              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="bg-white/80 backdrop-blur-sm">
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground mb-4 italic">
                        "{testimonial.text}"
                      </p>
                      <div className="font-semibold text-sm text-indigo-600">
                        — {testimonial.name}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Control of Your Health Anxiety?</h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of people who are building a healthier, more mindful relationship with online health information.
          </p>
          <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50">
            Install Choncious for Free
          </Button>
          <div className="mt-4 text-sm text-indigo-200">
            Compatible with Chrome • Privacy-focused • Open source
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
