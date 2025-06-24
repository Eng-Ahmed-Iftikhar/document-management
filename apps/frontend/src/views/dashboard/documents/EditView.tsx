import { useParams } from 'next/navigation';
import Form from 'sections/dashboard/documents/Form';

const EditView = () => {
  const { id }: { id: string } = useParams();
  return <Form id={Number(id)} />;
};

export default EditView;
