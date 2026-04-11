import { genericDeleteModel } from "@/api/services";
import { Modal } from "@/components/ui";
import { toastMessages } from "@/constants/auth";
import { ERROR_NOTIFICATIONS } from "@/constants/notifications";
import capitalizeWord from "@/utils/capitalizeWord";
import { toast } from "@/utils/customToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import TableData from "./TableData";

type TableActionsProps = {
  /**
   * This property must return the full working edit action node with all the options defined.
   * The component will only execute the prop and do no more work.
   * This is done so the TableAction component does not become tighly coupled with router logic.
   */
  renderEditLink: () => React.ReactNode;
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
  queryKey: readonly string[];
};

const TableActions: React.FC<TableActionsProps> = ({
  renderEditLink,
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
        title: toastMessages.admin.resourceDeleted(lowerResourceType).title,
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
        {renderEditLink()}
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
