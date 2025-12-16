exports.deleteOwner = (
  toDeleteOwner,
  comment,
  ownerId,
  db,
  res,
  getResponseJSON,
  fun = () => true,
) => {
  const innerFun = (fun) => {
    return (err) => {
      if (err) return res.status(500).json(getResponseJSON('0001003', String(comment)));
      return fun();
    };
  };

  if (toDeleteOwner) {
    return db.run('DELETE FROM owners WHERE owner_id = ?', [ownerId], innerFun(fun));
  }
  return fun();
};
