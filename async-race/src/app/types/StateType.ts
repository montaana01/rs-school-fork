export type StateType = {
  currentPage: number;
  selectedCarId: number | null;
  createForm: {
    carName: string;
    carColor: string;
  };
  updateForm: {
    carName: string;
    carColor: string;
  };
};
