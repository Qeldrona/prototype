// Next.js API route support: https://nextjs.org/docs/api-routes/introduction


const getName = () => {
  let random = Math.floor(Math.random() * 2);     // returns a random integer from 0 to 1

  if (random === 0) {
    return { name: 'Random0 Doe' };
  }
  if (random === 1) {
    return { name: 'Random1 Doe' };
  }

}

export default {
  getName
}