import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Filter, Plus, Search, Copy, Heart, MessageCircle, ExternalLink, 
  Upload, Download, Trash2, Settings, CheckCircle, X,
  Music, Video, Download as DownloadIcon, Gamepad2, Brain, 
  Globe, Search as SearchIcon, Database, Info, Wrench, Github, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useLikes } from '@/contexts/LikeContext';
import { API_ENDPOINTS } from '@/config/api';
import { 
  PERMANENT_PLUGINS, 
  getPermanentPluginTypes, 
  searchPermanentPlugins, 
  filterPermanentPluginsByType, 
  sortPermanentPlugins,
  PLUGIN_CATEGORIES
} from '@/data/permanentPlugins';
import PluginUploader from '@/components/PluginUploader';

// Debounce hook for search optimization
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const PluginsPage = () => {
  const { user, requireAuth, showLogin, setShowLogin, startGitHubLogin, loading: authLoading } = useAuth();
  const { plugins, loading, refreshData } = useData();
  const { toggleLike, getPendingLikeStatus } = useLikes();
  
  // Combined plugins state (permanent + backend)
  const [allPlugins, setAllPlugins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortFilter, setSortFilter] = useState('recent');
  const [statusFilter, setStatusFilter] = useState('all'); // all, approved, pending
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [backendError, setBackendError] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // all, community, pending

  // Debounced search term for performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const typeIcons = {
    audio: Music,
    video: Video,
    download: DownloadIcon,
    game: Gamepad2,
    AI: Brain,
    API: Globe,
    scrape: SearchIcon,
    data: Database,
    info: Info,
    tool: Wrench,
  };

  const typeColors = {
    audio: 'bg-purple-100 text-purple-800 border-purple-200',
    video: 'bg-red-100 text-red-800 border-red-200',
    download: 'bg-green-100 text-green-800 border-green-200',
    game: 'bg-blue-100 text-blue-800 border-blue-200',
    AI: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    API: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    scrape: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    data: 'bg-teal-100 text-teal-800 border-teal-200',
    info: 'bg-gray-100 text-gray-800 border-gray-200',
    tool: 'bg-orange-100 text-orange-800 border-orange-200',
  };

  // Load plugins on component mount
  useEffect(() => {
    combineAllPlugins();
  }, [plugins]);

  // Optimized filtering and sorting with memoization
  const filteredPlugins = useMemo(() => {
    let filtered = [...allPlugins];

    // Filter by search term
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(plugin =>
        plugin.name.toLowerCase().includes(searchLower) ||
        plugin.description.toLowerCase().includes(searchLower) ||
        plugin.author.toLowerCase().includes(searchLower) ||
        (plugin.tags && plugin.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(plugin => plugin.type === typeFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(plugin => plugin.status === statusFilter);
    }

    // Filter by active tab
    if (activeTab === 'community') {
      filtered = filtered.filter(plugin => plugin.source === 'backend');
    } else if (activeTab === 'pending') {
      filtered = filtered.filter(plugin => plugin.status === 'pending');
    }

    // Sort plugins
    filtered.sort((a, b) => {
      switch (sortFilter) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'likes':
          return (b.likes || 0) - (a.likes || 0);
        case 'recent':
        default:
          return new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0);
      }
    });

    return filtered;
  }, [allPlugins, debouncedSearchTerm, typeFilter, sortFilter, statusFilter, activeTab]);

  const combineAllPlugins = () => {
    let combined = [];
    
    // Add permanent plugins (always first)
    combined = [...PERMANENT_PLUGINS];
    
    // Add backend plugins
    combined = [...combined, ...plugins];
    
    setAllPlugins(combined);
  };

  const handleLikePlugin = (pluginId) => {
    const plugin = allPlugins.find(p => p.id === pluginId);
    
    // For now, just show a message since likes will be fetched from GitHub
    if (plugin?.gistLink) {
      window.open(plugin.gistLink, '_blank');
      toast.info('Redirected to GitHub Gist.');
    } else {
      toast.info('GitHub integration coming soon!');
    }
  };

  const copyPluginLink = (plugin) => {
    const pluginUrl = `${window.location.origin}/plugins?search=${encodeURIComponent(plugin.name)}`;
    navigator.clipboard.writeText(pluginUrl);
    toast.success('Plugin link copied to clipboard!');
  };

  const getTypeColor = (type) => {
    return typeColors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading plugins...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex-1">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Plugin Library</h1>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              {allPlugins.length} Total
            </Badge>
            {plugins.filter(p => p.status === 'pending').length > 0 && (
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                {plugins.filter(p => p.status === 'pending').length} Pending
              </Badge>
            )}
          </div>
          <p className="text-lg text-muted-foreground">
            Discover and manage plugins to extend your bot's functionality
          </p>
        </div>

        {/* Plugin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All ({allPlugins.length})</TabsTrigger>
            <TabsTrigger value="community">Community ({plugins.length})</TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({plugins.filter(p => p.status === 'pending').length})
              {plugins.filter(p => p.status === 'pending').length > 0 && (
                <Badge className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                  {plugins.filter(p => p.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search plugins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-base"
            />
          </div>
          <div className="flex gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex-1 sm:flex-none">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter & Sort</SheetTitle>
                  <SheetDescription>
                    Customize how plugins are displayed
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-6 mt-6">
                  <div className="space-y-2">
                    <Label>Plugin Type</Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        {PLUGIN_CATEGORIES.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="approved">Approved Only</SelectItem>
                        <SelectItem value="pending">Pending Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Sort By</Label>
                    <Select value={sortFilter} onValueChange={setSortFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="old">Most Old</SelectItem>
                        <SelectItem value="liked">Most Liked</SelectItem>
                        <SelectItem value="az">A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Plugin Management Buttons */}
            <Button
              className="bg-primary hover:bg-primary-hover flex-1 sm:flex-none"
              onClick={() => requireAuth(() => setShowAddDialog(true))}
            >
              <Plus className="w-4 h-4 mr-2" />
              Submit Plugin
            </Button>
          </div>
        </div>

        {/* Plugins Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPlugins.map((plugin) => {
            const TypeIcon = typeIcons[plugin.type];
            const isPending = plugin.status === 'pending';
            const isApproved = plugin.status === 'approved' || !plugin.status;
            
            return (
              <Card 
                key={plugin.id} 
                className={`border-border transition-all duration-300 flex flex-col ${
                  isPending 
                    ? 'opacity-60 bg-muted/30 border-muted cursor-not-allowed' 
                    : 'hover:shadow-lg card-hover'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className={`text-lg ${isPending ? 'text-muted-foreground' : ''}`}>
                          {plugin.name}
                        </CardTitle>
                        {isPending && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">by {plugin.author}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getTypeColor(plugin.type)} border ${isPending ? 'opacity-60' : ''}`}>
                        {TypeIcon && <TypeIcon className="w-3 h-3 mr-1" />}
                        {plugin.type}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className={`text-sm ${isPending ? 'text-muted-foreground/70' : ''}`}>
                    {plugin.description}
                    {isPending && (
                      <span className="block text-xs text-yellow-600 mt-2 font-medium">
                        ⏳ This plugin is awaiting manual approval
                      </span>
                    )}
                  </CardDescription>
                  
                  {/* Features */}
                  {plugin.features && plugin.features.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {plugin.features.slice(0, 2).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {plugin.features.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{plugin.features.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pt-0 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => !isPending && copyPluginLink(plugin)}
                        className={`text-xs ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isPending}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => !isPending && handleLikePlugin(plugin.id)}
                        className={`text-xs ${
                          isPending 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                        }`}
                        disabled={isPending}
                        title="View on GitHub"
                      >
                        <Heart className="w-3 h-3 mr-1" />
                        {plugin.likes || 0}
                      </Button>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => !isPending && plugin.gistLink && window.open(plugin.gistLink, '_blank')}
                      className={`text-xs ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isPending || !plugin.gistLink}
                      title="View Code"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredPlugins.length === 0 && !loading && (
          <div className="text-center py-16">
            {backendError ? (
              // Maintenance message when backend is down
              <div>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Website Under Maintenance</h3>
                <p className="text-muted-foreground mb-4">
                  We're currently performing maintenance on our servers. Please check back later.
                </p>
                <p className="text-sm text-muted-foreground">
                  Sorry for the inconvenience. We'll be back online soon!
                </p>
              </div>
            ) : (
              // No plugins found message when backend is working
              <div>
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No plugins found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Plugin Submission Sheet */}
      <Sheet open={showAddDialog} onOpenChange={setShowAddDialog}>
        <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle>Submit Plugin for Approval</SheetTitle>
            <SheetDescription>
              Submit your plugin to the community. It will be reviewed by admins before being published.
            </SheetDescription>
          </SheetHeader>
          
          <div className="pr-2"> {/* Add padding for scrollbar */}
            <PluginUploader onClose={() => setShowAddDialog(false)} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Login Dialog */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              Sign in with GitHub to add plugins and like content
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Github className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Welcome to Vinsmoke Bot</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Login with GitHub to add plugins, like content, and access personalized features.
              </p>
            </div>
            <Button
              onClick={startGitHubLogin}
              className="w-full bg-[#24292e] hover:bg-[#1a1e22] text-white"
            >
              <Github className="w-4 h-4 mr-2" />
              Continue with GitHub
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PluginsPage;