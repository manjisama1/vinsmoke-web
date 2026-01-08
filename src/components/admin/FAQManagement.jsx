import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Save, Eye, Palette, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PERMANENT_FAQS, getPermanentCategories } from '@/data/permanentFAQs';
import { HighlightedText, getHighlightColors } from '@/utils/textHighlight.jsx';

const FAQManagement = ({ onStatsUpdate }) => {
  // Use permanent FAQs for preview
  const faqs = PERMANENT_FAQS;
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewFAQ, setPreviewFAQ] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    tags: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: '',
      tags: ''
    });
  };

  const handlePreviewFAQ = () => {
    if (!formData.question || !formData.answer || !formData.category) {
      toast.error('Please fill in all required fields to preview');
      return;
    }

    const previewData = {
      id: `preview-${Date.now()}`,
      question: formData.question,
      answer: formData.answer,
      category: formData.category,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      isPermanent: false,
      isHardcoded: false
    };

    setPreviewFAQ(previewData);
    setShowPreviewDialog(true);
  };

  const handleCopyFAQJSON = async () => {
    if (!previewFAQ) return;

    const faqData = {
      id: `perm-${Date.now()}`,
      question: previewFAQ.question,
      answer: previewFAQ.answer,
      category: previewFAQ.category,
      tags: previewFAQ.tags,
      isPermanent: true,
      isHardcoded: true
    };

    try {
      const jsonString = JSON.stringify(faqData, null, 2);
      await navigator.clipboard.writeText(jsonString);
      toast.success('FAQ JSON copied to clipboard! Add it to permanentFAQs.js');
      
      // Clear form and close dialogs
      clearForm();
      setShowPreviewDialog(false);
      setShowAddDialog(false);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const categories = getPermanentCategories();

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <Button onClick={() => { clearForm(); setShowAddDialog(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Create FAQ
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">FAQ Management - Preview Mode</p>
              <p className="text-blue-700">
                Create and preview FAQs here. When you're satisfied with the preview, click "Copy JSON" to get the formatted data. 
                Then manually add it to <code>frontend/src/data/permanentFAQs.js</code> to make it permanent.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Highlight Colors Guide */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Text Highlighting Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            {getHighlightColors().map((color) => (
              <div key={color.name} className="flex items-center gap-2">
                <code className="bg-muted px-1 rounded">{color.syntax}</code>
                <HighlightedText text={color.example} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQs List */}
      <div className="grid gap-4">
        {filteredFAQs.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Search className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No FAQs found matching your search' : 'No FAQs found'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredFAQs.map((faq) => (
            <Card key={faq.id} className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-primary/10 text-primary">
                        {faq.category}
                      </Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                        Permanent
                      </Badge>
                      <span className="text-xs text-muted-foreground">ID: {faq.id}</span>
                    </div>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPreviewFAQ(faq);
                        setShowPreviewDialog(true);
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <HighlightedText 
                      text={faq.answer} 
                      className="text-sm text-muted-foreground leading-relaxed"
                    />
                  </div>
                  
                  {faq.tags && faq.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {faq.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add FAQ Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New FAQ</DialogTitle>
            <DialogDescription>
              Create a new FAQ entry. Use color highlighting syntax like red`text` for emphasis. Preview it first, then copy the JSON to add to the repository.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Question *</label>
                <Input
                  value={formData.question}
                  onChange={(e) => handleInputChange('question', e.target.value)}
                  placeholder="Enter the FAQ question"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <Input
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="Enter category (e.g., Getting Started, Features, etc.)"
                  list="categories"
                />
                <datalist id="categories">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Answer *</label>
              <Textarea
                value={formData.answer}
                onChange={(e) => handleInputChange('answer', e.target.value)}
                placeholder="Enter the detailed answer. Use red`text`, blue`text`, yellow`text` for highlighting."
                rows={6}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <Input
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="tag1, tag2, tag3"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate tags with commas
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePreviewFAQ}>
              <Eye className="w-4 h-4 mr-2" />
              Preview FAQ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview FAQ Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>FAQ Preview</DialogTitle>
            <DialogDescription>
              Preview how the FAQ will appear to users with highlighting. Copy the JSON to add it to the repository.
            </DialogDescription>
          </DialogHeader>
          
          {previewFAQ && (
            <div className="space-y-4 py-4">
              <div>
                <Badge className="bg-primary/10 text-primary mb-2">
                  {previewFAQ.category}
                </Badge>
                <h3 className="text-lg font-semibold">{previewFAQ.question}</h3>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <HighlightedText 
                  text={previewFAQ.answer} 
                  className="text-sm leading-relaxed"
                />
              </div>
              
              {previewFAQ.tags && previewFAQ.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {previewFAQ.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Instructions */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-blue-800">Manual Addition Process</h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Click "Copy JSON" to copy the FAQ data</li>
                  <li>2. Navigate to <code>frontend/src/data/permanentFAQs.js</code></li>
                  <li>3. Add the FAQ object to the PERMANENT_FAQS array</li>
                  <li>4. Commit and push the changes</li>
                </ol>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-3">
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              Close
            </Button>
            {previewFAQ && !previewFAQ.isPermanent && (
              <Button onClick={handleCopyFAQJSON} className="bg-green-600 hover:bg-green-700">
                <Copy className="w-4 h-4 mr-2" />
                Copy JSON
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Summary */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <p className="font-medium">{filteredFAQs.length}</p>
              <p className="text-muted-foreground">Total FAQs</p>
            </div>
            <div className="text-center">
              <p className="font-medium">{filteredFAQs.length}</p>
              <p className="text-muted-foreground">Permanent</p>
            </div>
            {categories.slice(0, 2).map(category => (
              <div key={category} className="text-center">
                <p className="font-medium">
                  {filteredFAQs.filter(f => f.category === category).length}
                </p>
                <p className="text-muted-foreground">{category}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQManagement;