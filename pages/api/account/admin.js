import { getAccountById, getAccountByUsername, updateAccount, createAccount } from 'lib/queries';
import { hashPassword } from 'lib/crypto';
import { ok, methodNotAllowed } from 'lib/response';

export default async (req, res) => {
  if (req.method === 'GET') {
    let created = undefined;
    const admin = {
        username: 'admin',
        password: process.env.ADMIN_PASSWORD,
        is_admin: true,
    }

    const account = await getAccountByUsername(admin.username);

    if(!account) {
        created = await createAccount({ username: admin.username, password: hashPassword(admin.password), is_admin: admin.is_admin });
    } else {
        created = account;
    }

    return ok(res, created);    
  }

  return methodNotAllowed(res);
};
