const initialState = [
  {
    id: '1',
    title: 'Agile менеджмент. Лидерство и управление командами',
    author: 'Donald Knut',
    total: 10,
    free: 5,
    img: 'http://www.apicius.es/wp-content/uploads/2012/07/IMG-20120714-009211.jpg'
  },
  {
    id: 2,
    title: 'Introducing to C#',
    author: 'Donald Knut',
    total: 10,
    free: 5
  },
  {
    id: 3,
    title: 'Introducing to C#',
    author: 'Donald Knut',
    total: 10,
    free: 5,
    img: 'http://www.apicius.es/wp-content/uploads/2012/07/IMG-20120714-009211.jpg'
  }
];

export const books = (state = initialState, action) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};
