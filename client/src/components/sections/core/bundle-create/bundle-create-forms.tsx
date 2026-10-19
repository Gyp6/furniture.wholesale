'use client';

import { BundleEditForm } from '../bundle-edit/bundle-edit-forms';

/** Create form shares the layout of the edit form; it just does not track changes. */
export function BundleCreateForm() {
  return <BundleEditForm />;
}
