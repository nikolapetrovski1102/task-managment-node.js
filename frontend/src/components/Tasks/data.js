// import axios from 'axios';

// async function fetchItems() {
//   let data;
//   try {
//     const response = await axios.get('http://localhost:8081/listTasks', {
//       headers: {
//         Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmdWxsbmFtZSI6Ik5pa29sYSIsImlkIjoiNjY1NjAyYjliMzM2YWViZjAyZjNlNzdlIiwiaWF0IjoxNzE2OTEzMDUwLCJleHAiOjE3MTY5MTY2NTB9.aT1Vf2vmY9iIaUABcHDoAH9lLYDaM3oZE0-_posRJxc'
//       }
//     });
    
//     data = response.data.task;

//     const ITEMS = data.map(element => {
//       console.log(element.name);
//       return element;
//     });

//     console.log(ITEMS);

//     return ITEMS;
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// }

// export default fetchItems;
