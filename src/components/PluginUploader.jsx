import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertCircle,
  Github,
  Loader2
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
    type: '',
    gistLink: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Plugin name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.gistLink.trim()) {
      newErrors.gistLink = 'GitHub Gist URL is required';
    } else {
      const gistUrlPattern = /^https:\/\/gist\.github\.com\/[^\/]+\/[a-f0-9]+/;
      if (!gistUrlPattern.test(formData.gistLink.trim())) {
        newErrors.gistLink = 'Please provide a valid GitHub Gist URL';
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
    
    if (!requireAuth()) return;
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const pluginData = {
        name: formData.name.trim(),
        author: user.login,
        authorName: user.name || user.login,
        authorId: user.id,
        description: formData.description.trim(),
        type: formData.type,
        gistLink: formData.gistLink.trim(),
        tags: [],
        features: [],
        submittedBy: user.id,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };

      const response = await fetch(API_ENDPOINTS.plugins, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pluginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        toast.success('Plugin submitted successfully!');
        setFormData({ name: '', description: '', type: '', gistLink: '' });
        setErrors({});
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

  if (!user) {
    return (
      <div className="text-center py-12">
        <Github className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Sign in Required</h3>
        <p className="text-muted-foreground mb-6">
          Please sign in with GitHub to submit plugins
        </p>
        <Button onClick={requireAuth} className="gap-2">
          <Github className="w-4 h-4" />
          Continue with GitHub
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Submit Plugin</h2>
        <p className="text-muted-foreground">
          Share your plugin with the community
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Plugin Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Plugin Name *</Label>
          <Input
            id="name"
            placeholder="YouTube Downloader"
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
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="What does your plugin do?"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className={`min-h-[80px] ${errors.description ? 'border-red-500' : ''}`}
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
          <Label htmlFor="type">Category *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            disabled={isSubmitting}
          >
            <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
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
          {errors.type && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.type}
            </p>
          )}
        </div>

        {/* GitHub Gist URL */}
        <div className="space-y-2">
          <Label htmlFor="gistLink">GitHub Gist URL *</Label>
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
        </div>

        {/* Author Info */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Author:</strong> {user.name || user.login}
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Plugin'
            )}
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
    </div>
  );
};

export default PluginUploader;