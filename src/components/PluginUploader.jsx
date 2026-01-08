import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { PLUGIN_CATEGORIES } from '@/data/permanentPlugins';
import { useAuth } from '@/contexts/AuthContext';
import { API_ENDPOINTS } from '@/config/api';

const PluginUploader = ({ onClose }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'tool',
    gistLink: '',
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.description || !formData.gistLink) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate gist URL
    if (!formData.gistLink.includes('gist.github.com')) {
      toast.error('Please provide a valid GitHub Gist URL');
      return;
    }

    setIsSubmitting(true);

    try {
      const pluginData = {
        name: formData.name.trim(),
        author: user?.name || user?.login || 'Anonymous',
        description: formData.description.trim(),
        type: formData.type,
        gistLink: formData.gistLink.trim(),
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        submittedBy: user?.id || user?.login || 'anonymous',
        submittedAt: new Date().toISOString()
      };

      const response = await fetch(API_ENDPOINTS.plugins, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pluginData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Plugin submitted successfully! It will appear in the admin panel for approval.');
        setFormData({
          name: '',
          description: '',
          type: 'tool',
          gistLink: '',
          tags: ''
        });
        if (onClose) onClose();
      } else {
        throw new Error(data.error || 'Failed to submit plugin');
      }
    } catch (error) {
      console.error('Submit Plugin Error:', error);
      toast.error(error.message || 'Failed to submit plugin');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Submit Plugin for Approval
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Submit your plugin to the community. It will be reviewed by admins before being added.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Plugin Name *</Label>
              <Input
                id="name"
                placeholder="My Awesome Plugin"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Category *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {PLUGIN_CATEGORIES.filter(cat => cat.value !== 'all').map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what your plugin does and its key features..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gistLink">GitHub Gist URL *</Label>
            <Input
              id="gistLink"
              type="url"
              placeholder="https://gist.github.com/username/gist-id"
              value={formData.gistLink}
              onChange={(e) => setFormData(prev => ({ ...prev, gistLink: e.target.value }))}
              required
            />
            <p className="text-xs text-muted-foreground">
              Provide the GitHub Gist URL containing your plugin code
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (optional)</Label>
            <Input
              id="tags"
              placeholder="tag1, tag2, tag3"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated tags to help users find your plugin
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.name || !formData.description || !formData.gistLink}
              className="flex-1"
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
            </Button>
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            )}
          </div>
        </form>

        {/* Info Note */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mt-4">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Submission Process:</p>
            <ul className="space-y-1 text-xs">
              <li>• Your plugin will be submitted for admin review</li>
              <li>• Admins can copy the plugin data from the admin panel</li>
              <li>• Once approved, it will appear in the community plugins</li>
              <li>• Author will be automatically set to your GitHub username</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PluginUploader;