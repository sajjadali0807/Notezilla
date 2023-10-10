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
import axios from "axios";

export default function BasicModalDialog() {
  const [open, setOpen] = React.useState(false);
  const [notes, setNotes] = React.useState([]);
  const [title, setTitle] = React.useState([]);
  const [reload, setReload] = React.useState();

  React.useEffect(() => {}, [reload]);

  // useEffect(() => {

  // }, [third])

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
              axios
                .post("http://192.168.2.109:9000/create/content", {
                  title: title,
                  content: notes,
                })
                .then((e) => {
                  console.log(e, "heloooo");
                  setReload("helooo");
                });
              setOpen(false);
            }}
          >
            <Stack spacing={2}>
              <TextField
                size="lg"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                color="primary"
                variant="outlined"
                placeholder="Title"
              />
              <Textarea
                color="neutral"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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
