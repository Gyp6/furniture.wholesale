import { INestApplication } from '@nestjs/common';

import { EXCLUDED_ROUTES } from '@/shared/constants/excluded-route.constant';

export function getExcludedRoutesConfig(app: INestApplication) {
  EXCLUDED_ROUTES.forEach(route => {
    app.use(route, (req: any, res: any, next: any) => next());
  });
}
