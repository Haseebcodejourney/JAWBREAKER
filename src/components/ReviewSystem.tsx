
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Star, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
  verified: boolean;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

interface ReviewSystemProps {
  clinicId: string;
  bookingId?: string;
  canReview?: boolean;
}

const ReviewSystem: React.FC<ReviewSystemProps> = ({
  clinicId,
  bookingId,
  canReview = false
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    content: ''
  });
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [clinicId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          title,
          content,
          created_at,
          verified,
          profiles!inner(first_name, last_name)
        `)
        .eq('clinic_id', clinicId)
        .eq('verified', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a review",
        variant: "destructive"
      });
      return;
    }

    if (newReview.rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          clinic_id: clinicId,
          patient_id: user.id,
          booking_id: bookingId,
          rating: newReview.rating,
          title: newReview.title,
          content: newReview.content,
          verified: false,
          moderated: false
        });

      if (error) throw error;

      toast({
        title: "Review submitted",
        description: "Your review has been submitted and will appear after moderation",
      });

      setNewReview({ rating: 0, title: '', content: '' });
      setShowReviewForm(false);
      fetchReviews();

    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Submission failed",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => onRatingChange?.(star) : undefined}
          />
        ))}
        {!interactive && <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading reviews...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Reviews</CardTitle>
          {canReview && !showReviewForm && (
            <Button onClick={() => setShowReviewForm(true)}>
              Write a Review
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {showReviewForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium mb-4">Write Your Review</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  {renderStars(newReview.rating, true, (rating) =>
                    setNewReview(prev => ({ ...prev, rating }))
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={newReview.title}
                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Summary of your experience"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Review</label>
                  <Textarea
                    value={newReview.content}
                    onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your experience with this clinic..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={submitReview} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No reviews yet. Be the first to review this clinic!
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {review.profiles.first_name} {review.profiles.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  {review.title && (
                    <h4 className="font-medium mb-2">{review.title}</h4>
                  )}
                  <p className="text-gray-700">{review.content}</p>
                  {review.verified && (
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      Verified Patient
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewSystem;
