import { create } from 'zustand';

import { CatalogTypes } from '@/constants';
import { TCatalogTypesValues } from '@/shared/types/catalog-type.type';

interface CatalogTypeState {
  type: TCatalogTypesValues;
}

interface CatalogTypeAction {
  setType: (type: TCatalogTypesValues) => void;
}

const initialState = {
  type: CatalogTypes.catalog,
};

export const useCatalogTypeStore = create<CatalogTypeState & CatalogTypeAction>(
  set => ({
    ...initialState,

    setType: type => set({ type }),
  }),
);
