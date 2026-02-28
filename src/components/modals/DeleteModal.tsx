import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DeleteModal = ({
  onOpenChange,
  open,
  title,
  data,
  id,
  handleDelete,
  loading,
}: {
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
  data: string;
  id: string;
  handleDelete: any;
  loading: boolean;
}) => {
  const onSubmit = () => {
    handleDelete(id);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="p-6 bg-white">
        <DialogHeader className="bg-white py-2 rounded-lg">
          <DialogTitle className="text-[20px] text-brand font-semibold font-inter">
            {title}
          </DialogTitle>
          <DialogDescription className="font-medium text-base text-neutral600 mt-4">
            Are you sure you want to delete{" "}
            <span className="break-all">
              <b>{data}</b>
            </span>{" "}
            ? <br />
            You won't be able to revert this action.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-sm flex items-center gap-4">
          <Button
            variant={"secondary"}
            onClick={onSubmit}
            loading={loading}
            className="h-[40px] bg-brand"
          >
            Delete
          </Button>
          <Button
            variant={"outline"}
            onClick={() => onOpenChange(false)}
            className="h-[40px] border-brand text-brand"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
