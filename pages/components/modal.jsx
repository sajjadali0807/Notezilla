import * as React from "react";
import Button from "@mui/joy/Button";
import Textarea from "@mui/joy/Textarea";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import Add from "@mui/icons-material/Add";
import Typography from "@mui/joy/Typography";
import { TextField } from "@mui/material";
import { TextFields } from "@mui/icons-material";

export default function BasicModalDialog() {
  const [open, setOpen] = React.useState(false);
  const [notes, setNotes] = React.useState();

  //   const handlecreate = () => {
  //     console.log(notes, "Hello sajjad");
  //   };
  return (
    <React.Fragment>
      <Button
        variant="solid"
        color="primary"
        startDecorator={<Add />}
        onClick={() => setOpen(true)}
      >
        Create Note
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          aria-describedby="basic-modal-dialog-description"
          sx={{ maxWidth: 1000 }}
        >
          <Typography id="basic-modal-dialog-title" level="h2">
            Create Note
          </Typography>
          <Typography id="basic-modal-dialog-description">
            Fill in the information of the project.
          </Typography>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              //   setOpen(false);
            }}
          >
            <Stack spacing={2}>
              <TextField
                size="lg"
                value={notes}
                // onChange={(e) => setNotes(e.target.value)}
                color="primary"
                variant="outlined"
                placeholder="Title"
              />
              <Textarea
                color="neutral"
                value={notes}
                // onChange={(e) => setNotes(e.target.value)}
                disabled={false}
                minRows={2}
                placeholder="Note"
                variant="outlined"
              />

              <Button type="submit">Submit</Button>
              <Button
                type="cancel"
                color="neutral"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
