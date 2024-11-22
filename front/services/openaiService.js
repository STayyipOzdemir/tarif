
import axios from 'axios';

const getRecipe = async (recipeData) => {
  try {
    const response = await axios.post('http://192.168.1.167:3000/recipe', recipeData);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : 'Tarif alınırken bir hata oluştu');
  }
};

export default getRecipe;
