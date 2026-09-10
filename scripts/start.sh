#!/bin/sh
set -e

echo "==> Starting RideWithKeijsi in Production..."

# Ensure /data directories exist
mkdir -p /data/instagram
mkdir -p /data/uploads

# Symlink persistent instagram downloads if needed or copy initial
if [ -d "/app/public/instagram" ] && [ ! -d "/data/instagram_init_done" ]; then
  echo "==> Copying initial instagram assets to persistent storage..."
  cp -rn /app/public/instagram/* /data/instagram/ 2>/dev/null || true
  touch /data/instagram_init_done
fi

# Ensure public/instagram points to /data/instagram so newly downloaded photos persist across deploys
rm -rf /app/public/instagram
ln -s /data/instagram /app/public/instagram

echo "==> Syncing database schema with Prisma..."
export DATABASE_URL="file:/data/prod.db"
npx prisma db push --skip-generate

# Check if admin user exists, if not run seed
echo "==> Verifying initial database seed..."
npx ts-node --transpile-only prisma/seed.ts || true

echo "==> Starting Next.js Production Server on port $PORT..."
exec npm run start
