import { useMutation, useQueryClient } from "@tanstack/react-query";
import TableData from "./TableData";
import { Link } from "react-router";
import { genericDeleteModel } from "../../api/endpoints/products";
import Modal from "../Modal";
import { useState } from "react";
import { toast } from "../../utils/customToast";
import { ERROR_NOTIFICATIONS } from "../../constants/notifications";
import capitalizeWord from "../../utils/capitalizeWord";

type TableActionsProps = {
  editLink: string;
  deleteLink: string;
  /**
   * Human-readable name of the resource type (e.g., "Product", "Category").
   * Used for dynamic modal titles and descriptions.
   */
  resourceType: string;

  /**
   * The key of the query that is responsible for fetching the item.
   * Used to invalidate the query and display a fresh new one.
   */
  queryKey: string[];
};

const TableActions: React.FC<TableActionsProps> = ({
  editLink,
  deleteLink,
  resourceType,
  queryKey,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const capitalizedResourceType = resourceType
    .split(" ")
    .map((word) => capitalizeWord(word))
    .join(" ");
  const lowerResourceType = resourceType.toLowerCase();

  const { mutate, isPending } = useMutation({
    mutationFn: genericDeleteModel,
    onSuccess: () => {
      toast.success({
        title: `The ${lowerResourceType} was deleted successfully.`,
      });
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      toast.error({
        title: ERROR_NOTIFICATIONS.GENERIC_ERROR.title,
        description: ERROR_NOTIFICATIONS.GENERIC_ERROR.description,
      });
    },
  });

  return (
    <>
      <TableData className="text-right">
        <Link
          to={editLink}
          className="text-oyster/80 hover:text-oyster mr-3 font-medium duration-300"
        >
          Edit
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="cursor-pointer font-medium text-red-500 duration-300 hover:text-red-600"
        >
          Delete
        </button>
      </TableData>

      <Modal
        title={`Delete ${capitalizedResourceType}`}
        description={`Are you sure you want to delete this ${lowerResourceType}? This action cannot be undone.`}
        variant="danger"
        isOpen={isOpen}
        isPending={isPending}
        onClose={() => setIsOpen(false)}
        onConfirm={() => mutate(deleteLink)}
      />
    </>
  );
};

export default TableActions;
