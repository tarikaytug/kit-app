// Api çağrısını yapıyoruz.

const API_URL = 'https://www.googleapis.com/books/v1/volumes';

export const searchBooks = async (query) => {
  try {
    const response = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    if (!data.items) {
      return [];
    }

    return data.items.map(item => ({
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Bilinmeyen Yazar',
      description: item.volumeInfo.description,
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
      publishedDate: item.volumeInfo.publishedDate,
      publisher: item.volumeInfo.publisher
    }));
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};