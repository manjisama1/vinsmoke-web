import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus,
  AlertCircle,
  User,
  Github
} from 'lucide-react';
import { toast } from 'sonner';
import { PLUGIN_CATEGORIES } from '@/data/permanentPlugins';
import { useAuth } from '@/contexts/AuthContext';
import { API_ENDPOINTS } from '@/config/api';

const PluginUploader = ({ onClose }) => {
  const { user, requireAuth } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'tool',
    gistLink: '',
    tags: '',
    features: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validation
    if (!formData.name.trim()) {
      newErrors.name = 'Plugin name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Plugin name must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.gistLink.trim()) {
      newErrors.gistLink = 'GitHub Gist URL is required';
    } else {
      // Validate gist URL format - more flexible validation
      const gistUrlPattern = /^https:\/\/gist\.github\.com\/[^\/]+\/[a-f0-9]{32}$/;
      const rawGistPattern = /^https:\/\/gist\.githubusercontent\.com\/[^\/]+\/[a-f0-9]{32}\/raw/;
      const simpleGistPattern = /^https:\/\/gist\.github\.com\/[^\/]+\/[a-f0-9]+/;
      
      if (!gistUrlPattern.test(formData.gistLink.trim()) && 
          !rawGistPattern.test(formData.gistLink.trim()) && 
          !simpleGistPattern.test(formData.gistLink.trim())) {
        newErrors.gistLink = 'Please provide a valid GitHub Gist URL (e.g., https://gist.github.com/username/abc123...)';
      }
    }
    
    if (!formData.type) {
      newErrors.type = 'Plugin type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check authentication first
    if (!requireAuth()) {
      return;
    }

    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const pluginData = {
        name: formData.name.trim(),
        author: user.login, // Use GitHub username as author
        authorName: user.name || user.login, // Display name
        authorId: user.id, // GitHub user ID
        description: formData.description.trim(),
        type: formData.type,
        gistLink: formData.gistLink.trim(),
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(Boolean) : [],
        submittedBy: user.id,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };

      const response = await fetch(API_ENDPOINTS.plugins, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pluginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        toast.success('Plugin submitted successfully! It will be reviewed by admins before being published.');
        setFormData({
          name: '',
          description: '',
          type: 'tool',
          gistLink: '',
          tags: '',
          features: ''
        });
        setErrors({});
        if (onClose) onClose();
      } else {
        throw new Error(data.error || 'Failed to submit plugin');
      }
    } catch (error) {
      console.error('Submit Plugin Error:', error);
      toast.error(error.message || 'Failed to submit plugin. Please try again.');
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
          Submit your plugin to the community. It will be reviewed by admins before being published.
        </p>
        {user && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border">
            <Github className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              Submitting as: <strong>{user.name || user.login}</strong>
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {!user ? (
          <div className="text-center py-8">
            <User className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
            <p className="text-gray-600 mb-4">
              Please sign in with GitHub to submit plugins
            </p>
            <Button onClick={requireAuth} className="gap-2">
              <Github className="w-4 h-4" />
              Continue with GitHub
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Plugin Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-1">
                Plugin Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., YouTube Downloader"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={errors.name ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-1">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what your plugin does, its features, and how to use it..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Plugin Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="flex items-center gap-1">
                Plugin Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                disabled={isSubmitting}
              >
                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select plugin type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PLUGIN_CATEGORIES).map(([key, category]) => (
                    <SelectItem key={key} value={key}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.type}
                </p>
              )}
            </div>

            {/* GitHub Gist URL */}
            <div className="space-y-2">
              <Label htmlFor="gistLink" className="flex items-center gap-1">
                GitHub Gist URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="gistLink"
                type="url"
                placeholder="https://gist.github.com/username/abc123..."
                value={formData.gistLink}
                onChange={(e) => setFormData(prev => ({ ...prev, gistLink: e.target.value }))}
                className={errors.gistLink ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              {errors.gistLink && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.gistLink}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Upload your plugin code to a GitHub Gist and paste the URL here
              </p>
            </div>

            {/* Tags (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="tags">
                Tags <span className="text-gray-500">(Optional)</span>
              </Label>
              <Input
                id="tags"
                type="text"
                placeholder="e.g., media, download, youtube (comma-separated)"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">
                Add relevant tags separated by commas to help users find your plugin
              </p>
            </div>

            {/* Features (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="features">
                Key Features <span className="text-gray-500">(Optional)</span>
              </Label>
              <Textarea
                id="features"
                placeholder="e.g., High quality downloads, Multiple formats, Fast processing (comma-separated)"
                value={formData.features}
                onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                className="min-h-[80px]"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">
                List the main features of your plugin, separated by commas
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Plugin'}
              </Button>
              {onClose && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default PluginUploader;