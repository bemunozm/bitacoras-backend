-- DropForeignKey
ALTER TABLE "role_user" DROP CONSTRAINT "role_user_role_id_fkey";

-- DropForeignKey
ALTER TABLE "role_user" DROP CONSTRAINT "role_user_user_id_fkey";

-- AddForeignKey
ALTER TABLE "role_user" ADD CONSTRAINT "role_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_user" ADD CONSTRAINT "role_user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
