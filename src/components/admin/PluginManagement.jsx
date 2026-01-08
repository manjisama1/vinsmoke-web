import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Trash2, Search, RefreshCw, Check, X, Eye, Calendar, User, Heart, ExternalLink, Copy, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { adminApi } from '@/utils/adminApi';
import { useAdminData } from '@/contexts/AdminDataContext';
import { generatePluginId } from '@/utils/idGenerator';

const PluginManagement = ({ onStatsUpdate }) => {
  const { plugins, loading, refreshData, updatePlugin, deletePlugin } = useAdminData();
  const [pluginRequests, setPluginRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [activeTab, setActiveTab] = useState('approved');

  const updatePluginStatus = (pluginId, status) => {
    updatePlugin(pluginId, { status });
    toast.success(`Plugin ${status}! Click "Save Changes" to apply.`);
  };

  const handleApprovePlugin = (plugin) => {
    setSelectedPlugin(plugin);
    setShowApprovalDialog(true);
  };

  const handleCopyPluginJSON = async () => {
    if (!selectedPlugin) return;

    // Format plugin for permanent plugins array - clean and production ready
    const formattedPlugin = {
      id: generatePluginId(),
      name: selectedPlugin.name,
      author: selectedPlugin.author,
      description: selectedPlugin.description,
      type: selectedPlugin.type,
      gistLink: selectedPlugin.gistLink || `https://gist.github.com/${selectedPlugin.author}/${selectedPlugin.name.toLowerCase().replace(/\s+/g, '-')}`,
      tags: selectedPlugin.tags || [],
      features: selectedPlugin.features || []
    };

    try {
      const jsonString = JSON.stringify(formattedPlugin, null, 2);
      await navigator.clipboard.writeText(jsonString);
      toast.success('Plugin JSON copied to clipboard! Add it to permanentPlugins.js');
      
      // Mark as approved in backend
      updatePluginStatus(selectedPlugin.id, 'approved');
      
      setShowApprovalDialog(false);
      setSelectedPlugin(null);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleDeletePlugin = (pluginId) => {
    if (!confirm('Are you sure you want to delete this plugin? Click "Save Changes" to apply the deletion.')) return;

    deletePlugin(pluginId);
    toast.success('Plugin marked for deletion! Click "Save Changes" to apply.');
  };

  const downloadPluginData = () => {
    try {
      const dataStr = JSON.stringify(plugins, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plugins-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Plugin data downloaded');
    } catch (error) {
      console.error('Error downloading plugin data:', error);
      toast.error('Error downloading plugin data.');
    }
  };

  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || plugin.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'sticker': return 'bg-blue-100 text-blue-800';
      case 'media': return 'bg-purple-100 text-purple-800';
      case 'fun': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <Button onClick={refreshData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={downloadPluginData}>
            <Download className="w-4 h-4 mr-2" />
            Download All
          </Button>
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search plugins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Plugins List */}
      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="p-6 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading plugins...</p>
            </CardContent>
          </Card>
        ) : filteredPlugins.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Eye className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchQuery || filterStatus !== 'all' ? 'No plugins found matching your criteria' : 'No plugins found'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPlugins.map((plugin) => (
            <Card key={plugin.id} className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{plugin.name}</CardTitle>
                      <Badge className={getStatusColor(plugin.status)}>
                        {plugin.status || 'pending'}
                      </Badge>
                      <Badge className={getTypeColor(plugin.type)}>
                        {plugin.type}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{plugin.description}</p>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    {plugin.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApprovePlugin(plugin)}
                          className="text-green-600 hover:text-green-700"
                          title="Approve & Copy JSON"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updatePluginStatus(plugin.id, 'rejected')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePlugin(plugin.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Author</p>
                      <p className="text-muted-foreground">{plugin.author}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Likes</p>
                      <p className="text-muted-foreground">{plugin.likes || 0}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Created</p>
                      <p className="text-muted-foreground">
                        {plugin.createdAt ? new Date(plugin.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Gist Link</p>
                      <a 
                        href={plugin.gistLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-xs"
                      >
                        View Code
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Plugin Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Approve Plugin</DialogTitle>
            <DialogDescription>
              Copy the plugin JSON data and manually add it to the repository
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlugin && (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Plugin Details</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {selectedPlugin.name}</p>
                  <p><strong>Author:</strong> {selectedPlugin.author}</p>
                  <p><strong>Type:</strong> {selectedPlugin.type}</p>
                  <p><strong>Description:</strong> {selectedPlugin.description}</p>
                  {selectedPlugin.tags && selectedPlugin.tags.length > 0 && (
                    <p><strong>Tags:</strong> {Array.isArray(selectedPlugin.tags) ? selectedPlugin.tags.join(', ') : selectedPlugin.tags}</p>
                  )}
                  {selectedPlugin.features && selectedPlugin.features.length > 0 && (
                    <p><strong>Features:</strong> {Array.isArray(selectedPlugin.features) ? selectedPlugin.features.join(', ') : selectedPlugin.features}</p>
                  )}
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-blue-800">Manual Approval Process</h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Click "Copy JSON" to copy the plugin data</li>
                  <li>2. Navigate to <code>frontend/src/data/permanentPlugins.js</code></li>
                  <li>3. Add the plugin object to the PERMANENT_PLUGINS array</li>
                  <li>4. Commit and push the changes</li>
                  <li>5. Plugin will be marked as approved in the backend</li>
                </ol>
              </div>

              {/* Preview of JSON structure */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-gray-800">JSON Preview</h4>
                <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
{`{
  "id": "${generatePluginId()}",
  "name": "${selectedPlugin.name}",
  "author": "${selectedPlugin.author}",
  "description": "${selectedPlugin.description}",
  "type": "${selectedPlugin.type}",
  "gistLink": "${selectedPlugin.gistLink || `https://gist.github.com/${selectedPlugin.author}/${selectedPlugin.name.toLowerCase().replace(/\s+/g, '-')}`}",
  "tags": ${JSON.stringify(selectedPlugin.tags || [])},
  "features": ${JSON.stringify(selectedPlugin.features || [])}
}`}
                </pre>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-3">
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCopyPluginJSON} className="bg-green-600 hover:bg-green-700">
              <Copy className="w-4 h-4 mr-2" />
              Copy JSON & Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Summary */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <p className="font-medium">{filteredPlugins.length}</p>
              <p className="text-muted-foreground">Total</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-yellow-600">
                {filteredPlugins.filter(p => p.status === 'pending').length}
              </p>
              <p className="text-muted-foreground">Pending</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-green-600">
                {filteredPlugins.filter(p => p.status === 'approved').length}
              </p>
              <p className="text-muted-foreground">Approved</p>
            </div>
            <div className="text-center">
              <p className="font-medium text-red-600">
                {filteredPlugins.filter(p => p.status === 'rejected').length}
              </p>
              <p className="text-muted-foreground">Rejected</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PluginManagement;