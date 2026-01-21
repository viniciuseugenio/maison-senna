const LoadingRow: React.FC<{ colSpan: number }> = ({ colSpan }) => {
  return (
    <tr>
      <td colSpan={colSpan} className="text-mine-shaft px-6 py-4 text-center">
        Loading...
      </td>
    </tr>
  );
};

export default LoadingRow;
