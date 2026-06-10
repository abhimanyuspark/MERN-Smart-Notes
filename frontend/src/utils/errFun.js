export const errorFun = (error) => {
  const errMsg = error.response?.data?.message || error.message;
  console.log(errMsg);
  return errMsg;
};
