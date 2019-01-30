import platform from "../models/iaplatform";
import models from "../models";

const Platform = platform(models.sequelize, models.Sequelize);

export const verifyToken = async (token) => {
  try {
    const tokenVerify = await Platform.findOne({
      where: {
        token: token
      }
    });
    if(tokenVerify){
      return true;
    }else{
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};
