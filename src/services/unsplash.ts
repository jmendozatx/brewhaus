import axios from 'axios';

const unsplashApi = axios.create({
  baseURL: 'https://api.unsplash.com',
});

let imagePool: string[] = [];
let currentIndex = 0;
let isInitialized = false;

export const initializeImagePool = async () => {
  if (isInitialized) return;

  try {
    const response = await unsplashApi.get('/photos/random', {
      params: {
        query: 'beer brewery',
        orientation: 'landscape',
        client_id: 'q0p7iNjAt0ux8uH-72vvvGo6HAWjjDehZGMP81GuqD0',
        count: 3
      }
    });
    imagePool = response.data.map((item: any) => item.urls.small);
    isInitialized = true;
  } catch (error) {
    console.error('Error fetching images from Unsplash:', error);
    // Fallback images in case the API fails
    imagePool = [
      '/fallback/fallback1.jpg',
      '/fallback/fallback2.jpg',
      '/fallback/fallback3.jpg'
    ];
    isInitialized = true;
  }
};

export const getNextBeerImage = () => {
  if (!isInitialized) {
    return '/fallback/fallback1.jpg';
  }
  const image = imagePool[currentIndex];
  currentIndex = (currentIndex + 1) % imagePool.length;
  return image;
};

export const isImagePoolReady = () => isInitialized;
