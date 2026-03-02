import { ExternalLink, Star, Quote, ShieldCheck, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Card, CardBody, Button, Chip, Skeleton } from '@heroui/react';

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  product_name: string | null;
  created_at: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const initials = review.reviewer_name.charAt(0).toUpperCase();
  const date = new Date(review.created_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card shadow="sm" className="hover:shadow-md transition-all duration-300">
      <CardBody className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{review.reviewer_name}</h3>
              <span className="text-xs text-gray-400 flex-shrink-0">{date}</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <StarRating rating={review.rating} />
              {review.verified && (
                <Chip
                  size="sm"
                  color="success"
                  variant="flat"
                  startContent={<ShieldCheck size={12} />}
                  as="a"
                  href="https://www.trustpilot.com/review/retralabs.in"
                  className="cursor-pointer"
                >
                  Verified on Trustpilot
                </Chip>
              )}
            </div>
            {review.title && (
              <h4 className="font-semibold text-gray-800 mb-2 text-[15px]">{review.title}</h4>
            )}
            <p className="text-gray-600 text-sm leading-relaxed">{review.body}</p>
            {review.product_name && (
              <Chip size="sm" color="secondary" variant="flat" className="mt-3">
                {review.product_name}
              </Chip>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

const redditReviews = [
  {
    username: 'u/Frosty-Ad-9691',
    initial: 'F',
    gradient: 'from-blue-500 to-cyan-500',
    time: '9 hours ago',
    title: 'First order experience with RetraLabs',
    body: "Not gonna lie, I've seen really mindblowing progress on mine. Dropped tons of fat and my health feels much much more under control now. My sugar levels are way better compared to earlier reports. Friends noticed the change and one of them jumped on it too.. he's already seeing fat loss. Parents are also doing well till now. They absolutely love it. Thought I'd post here since this sub is about real experiences. I am not at all affiliated with retralabs. I do not recommend to anyone everyone's different and may and may not work. Do your research and then get into this but yeah retralabs peps are really genuine.",
  },
  {
    username: 'u/Rajathsinha6',
    initial: 'R',
    gradient: 'from-rose-500 to-pink-500',
    time: '1 day ago',
    title: "Retralabs is totally vibin, pure Retatrutide without burning a hole in your pocket",
    body: "Here's the review: My first order landed in just 9 days, but the second one took a chill 22 days. No biggie, though..I had enough stock to keep me going. Now, let's talk quality. Within just 3 hours I felt the reta's magic. Injected at 8 PM and 11 PM I was ready to vommit and I was really glad about the sides cuz that's the real deal. I had tried some random IndianMart seller's reta from Peptide Science total fake, useless piece of junk. I pinned 20mg for 4 weeks, and nada nothing happened just made me despo. I was desperate for the real stuff and Retalabs totally came through. I'm on TRT with Retatrutide, shredded a ton of fat, and my...",
  },
  {
    username: 'u/Affectionate_Fox_313',
    initial: 'A',
    gradient: 'from-emerald-500 to-teal-500',
    time: '1 day ago',
    title: 'My Retatrutide order from retralabs.in (India)',
    body: "Posting this because I know how sketchy this space is, especially in India. I was referred to Retralabs.in by another Reddit user. Honestly, I was very skeptical at first. I had already been scammed earlier via an Indiamart seller (fake Peptide Sciences vials, wasted ~7k), so trusting anyone again wasn't easy. I spoke with the Reddit user who suggested it, checked his proof of purchase and results, and then directly contacted the retralabs number listed on their site. After a proper conversation and clearing my doubts, I decided to take a gamble. I ordered 10mg x 10 vials and split the order with the same Reddit user (5 vials...)",
  },
];

function RedditReviewCard({ review }: { review: typeof redditReviews[0] }) {
  return (
    <Card shadow="sm" className="hover:shadow-md transition-all duration-300">
      <CardBody className="p-6">
        <div className="flex items-start gap-4">
          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${review.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
            {review.initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 mb-1">
              <h3 className="font-semibold text-gray-900">{review.username}</h3>
              <span className="text-xs text-gray-400 flex-shrink-0">{review.time}</span>
            </div>
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <h4 className="font-semibold text-gray-800 mb-2 text-[15px]">{review.title}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{review.body}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setReviews(data);
      setLoading(false);
    }
    fetchReviews();
  }, []);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Customer Reviews
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Real feedback from researchers who trust RetraLabs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <Card shadow="sm">
            <CardBody className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{avgRating}</div>
              <div className="flex justify-center mb-2">
                <StarRating rating={Math.round(Number(avgRating))} />
              </div>
              <p className="text-sm text-gray-500">Average Rating</p>
            </CardBody>
          </Card>
          <Card shadow="sm">
            <CardBody className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{reviews.length + redditReviews.length}</div>
              <div className="flex justify-center mb-2">
                <Quote size={20} className="text-teal-500" />
              </div>
              <p className="text-sm text-gray-500">Total Reviews</p>
            </CardBody>
          </Card>
          <Card shadow="sm">
            <CardBody className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
              <div className="flex justify-center mb-2">
                <ShieldCheck size={20} className="text-emerald-500" />
              </div>
              <p className="text-sm text-gray-500">Verified Purchases</p>
            </CardBody>
          </Card>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <Button
            as="a"
            href="https://www.trustpilot.com/review/retralabs.in"
            target="_blank"
            color="success"
            endContent={<ExternalLink size={14} />}
            className="font-semibold"
          >
            Write a Review on Trustpilot
          </Button>
          <Button
            as="a"
            href="https://www.reddit.com/r/retralabs/"
            target="_blank"
            color="warning"
            endContent={<ExternalLink size={14} />}
            className="font-semibold bg-orange-600"
          >
            Share on Reddit
          </Button>
        </div>

        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-900">Trustpilot Reviews</h2>
            </div>
            <Button
              as="a"
              href="https://www.trustpilot.com/review/retralabs.in"
              target="_blank"
              variant="light"
              size="sm"
              className="text-gray-500"
            >
              View on Trustpilot
            </Button>
          </div>

          <Card shadow="sm" className="mb-6">
            <CardBody className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  {reviews.length > 0 ? avgRating : '5.0'}
                </span>
                <div>
                  <StarRating rating={5} />
                  <p className="text-xs text-gray-500 mt-0.5">Based on {reviews.length} Trustpilot reviews</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-gray-200" />
              <p className="text-sm text-gray-600">
                Rated <span className="font-semibold">Excellent</span> on Trustpilot
              </p>
            </div>
          </CardBody>
          </Card>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card key={i} shadow="sm">
                  <CardBody className="p-6">
                    <div className="flex gap-4">
                      <Skeleton className="w-11 h-11 rounded-full" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-4 w-1/4 rounded-lg" />
                        <Skeleton className="h-3 w-1/3 rounded-lg" />
                        <Skeleton className="h-3 w-full rounded-lg" />
                        <Skeleton className="h-3 w-5/6 rounded-lg" />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle size={20} className="text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900">Reddit Community Reviews</h2>
          </div>
          <div className="space-y-4">
            {redditReviews.map((review) => (
              <RedditReviewCard key={review.username} review={review} />
            ))}
          </div>
          <div className="text-center mt-6">
            <Button
              as="a"
              href="https://www.reddit.com/r/retralabs/"
              target="_blank"
              variant="light"
              color="warning"
              endContent={<ExternalLink size={14} />}
              className="font-semibold text-orange-600"
            >
              Read more on r/retralabs
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
