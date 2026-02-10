import React, { useState } from 'react';
import { Station, Review } from '../types';
import { Icon } from '../components/Icon';

interface StationDetailViewProps {
  station: Station;
  onBack: () => void;
}

export const StationDetailView: React.FC<StationDetailViewProps> = ({ station, onBack }) => {
  const [reviews, setReviews] = useState<Review[]>(station.reviews || []);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) return;

    const newReview: Review = {
      id: Date.now().toString(),
      userName: "You",
      rating: newRating,
      text: newReviewText,
      date: "Just now"
    };

    setReviews([newReview, ...reviews]);
    setShowReviewForm(false);
    setNewRating(0);
    setNewReviewText("");
  };

  const handleStatusReport = (status: string) => {
    // In a real app, this would send data to backend
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const renderStars = (rating: number, interactive: boolean = false, size: number = 20) => {
    return (
      <div className="flex text-yellow-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setNewRating(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <Icon 
              name="star" 
              filled={star <= rating} 
              className={star <= rating ? "text-yellow-400" : "text-slate-200 dark:text-slate-600"} 
              size={size}
            />
          </button>
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : "New";

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark overflow-y-auto relative">
      {/* Top Navigation */}
      <div className="sticky top-0 z-10 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent absolute w-full pointer-events-none">
        <button 
          onClick={onBack}
          className="pointer-events-auto p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <Icon name="arrow_back" />
        </button>
        <button className="pointer-events-auto p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
          <Icon name="layers" />
        </button>
      </div>

      {/* Hero Image */}
      <div className="relative h-72 w-full shrink-0">
        <img 
          src={station.image || "https://picsum.photos/800/600"} 
          alt={station.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent opacity-80 h-20 bottom-0 top-auto"></div>
      </div>

      {/* Content Container */}
      <div className="flex-1 px-5 -mt-6 relative z-10 pb-10">
        {/* Title Block */}
        <div className="bg-surface dark:bg-surface-dark rounded-xl shadow-sm p-4 border border-slate-100 dark:border-slate-800 mb-4">
            <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{station.name}</h1>
                <button className="text-slate-400 hover:text-slate-600">
                    <Icon name="close" className="opacity-0" /> {/* Spacer */}
                    <Icon name="close" className="absolute top-4 right-4 text-xl" /> 
                </button>
            </div>
            <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-4 gap-2">
                <span>{station.distance || 'Nearby'}</span>
                <span>•</span>
                <span>{station.address}</span>
            </div>
            
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <div className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs font-semibold flex items-center gap-1">
                        <Icon name="water_drop" size={16} filled />
                        {station.type === 'fountain' ? 'Fountain' : station.type === 'bottle_filler' ? 'Bottle Filler' : 'Tap'}
                    </div>
                    <div className="px-2.5 py-1 rounded-md bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 text-xs font-semibold flex items-center gap-1">
                        <Icon name="verified" size={16} filled />
                        Verified
                    </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-md">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{averageRating}</span>
                    <Icon name="star" filled className="text-yellow-400" size={16} />
                </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
             <button className="flex items-center justify-center gap-2 p-3 rounded-xl bg-primary text-white font-semibold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors active:scale-95">
                <Icon name="directions" />
                Navigate
             </button>
             <button className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-surface-dark text-slate-700 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors active:scale-95">
                <Icon name="share" />
                Share
             </button>
        </div>

        {/* Info Section */}
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 p-5 mb-4">
            <div className="flex items-start gap-4 mb-4">
                <Icon name="info" className="text-slate-400 mt-1" />
                <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Access Notes</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                        {station.accessNotes || "Located by the main gate, next to the bike racks. The pressure is low but usable for filling bottles."}
                    </p>
                </div>
            </div>
        </div>

         {/* Status Report */}
         <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 p-5 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">Is it working?</h3>
                <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                    Last confirmed: {station.lastConfirmed || 'Unknown'}
                </span>
            </div>
            
            <div className="flex flex-col gap-3">
                <button 
                    onClick={() => handleStatusReport('working')}
                    className="w-full p-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all"
                >
                    <Icon name="check_circle" filled />
                    Still working
                </button>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => handleStatusReport('unavailable')}
                        className="w-full p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-semibold flex items-center justify-center gap-2 hover:bg-orange-200 dark:hover:bg-orange-900/50 active:scale-[0.98] transition-all"
                    >
                        <Icon name="block" />
                        Not available
                    </button>
                    <button 
                        onClick={() => handleStatusReport('broken')}
                        className="w-full p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-semibold flex items-center justify-center gap-2 hover:bg-red-200 dark:hover:bg-red-900/50 active:scale-[0.98] transition-all"
                    >
                        <Icon name="build" />
                        Out of order
                    </button>
                </div>
            </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Reviews ({reviews.length})</h3>
                <button 
                  onClick={() => setShowReviewForm(true)}
                  className="text-primary font-semibold text-sm hover:text-primary-dark"
                >
                  Write a Review
                </button>
            </div>

            <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400">No reviews yet. Be the first!</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold text-xs">
                                    {review.userName.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-semibold text-sm text-slate-900 dark:text-white">{review.userName}</div>
                                    <div className="text-xs text-slate-400">{review.date}</div>
                                </div>
                            </div>
                            {renderStars(review.rating, false, 14)}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                            {review.text}
                        </p>
                    </div>
                  ))
                )}
            </div>
        </div>

      </div>

      {/* Write Review Modal */}
      {showReviewForm && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Write a Review</h3>
                    <button onClick={() => setShowReviewForm(false)} className="text-slate-400 hover:text-slate-600">
                        <Icon name="close" size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmitReview}>
                    <div className="flex flex-col items-center mb-6">
                        <p className="text-slate-500 dark:text-slate-400 mb-3 text-sm">Tap to rate</p>
                        {renderStars(newRating, true, 36)}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Experience</label>
                        <textarea
                            value={newReviewText}
                            onChange={(e) => setNewReviewText(e.target.value)}
                            placeholder="Was the water cold? Is the pressure good?"
                            className="w-full p-3 rounded-xl bg-background-light dark:bg-background-dark border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow resize-none"
                            rows={4}
                            required
                        ></textarea>
                    </div>

                    <button 
                        type="submit"
                        disabled={newRating === 0}
                        className="w-full h-12 bg-primary hover:bg-primary-dark disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold rounded-xl shadow-lg shadow-primary/20 disabled:shadow-none transition-all active:scale-[0.98]"
                    >
                        Post Review
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="bg-slate-900/90 dark:bg-white/90 backdrop-blur text-white dark:text-slate-900 px-6 py-3 rounded-full shadow-xl flex items-center gap-3">
                <Icon name="favorite" className="text-red-500" filled />
                <span className="font-medium">Thanks for helping 💙</span>
            </div>
        </div>
      )}

    </div>
  );
};
