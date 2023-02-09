import { Table, Tbody } from 'react-super-responsive-table';

function InfoTwoWrapper({ children }) {
  return (
    <Table>
      <Tbody>{children}</Tbody>
    </Table>
  );
}

export default InfoTwoWrapper;
