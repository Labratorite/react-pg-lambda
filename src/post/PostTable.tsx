import React from "react";
import { useFormContext } from "react-hook-form";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridSelectionModel,
  GridRowId,
  GRID_CHECKBOX_SELECTION_COL_DEF
} from "@mui/x-data-grid";

const columns: GridColDef[] = [
  {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    renderHeader: () => "Target"
  },
  { field: "id", headerName: "ID", width: 70 },
  { field: "title", headerName: "Title", width: 130 },
  { field: "author", headerName: "Author", width: 130 },
  {
    field: "content",
    headerName: "Age",
    type: "number",
    width: 90
  },
  {
    field: "test",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row._type || ""} ${params.row.title || ""}`
  }
];

const PostTableCommponent: React.FC<{ posts: Post[] }> = ({ posts }) => {
  console.log("PostTableCommponent");

  const { setValue } = useFormContext<HookForm>();
  const [selection, setSelectionModel] = React.useState<GridSelectionModel>([]);

  const onSelectionModelChange = (newSelection: GridSelectionModel) => {
    console.log("selectionModel", newSelection.toString());
    setSelectionModel((state) => {
      console.log("1");
      if (newSelection.length === 0) {
        console.log("2");
        return [];
      } else if (
        state.length < newSelection.length &&
        newSelection.length - state.length > 1
      ) {
        console.log("3");
        return [newSelection.shift()];
      }
      console.log("4");
      return [newSelection.pop()];
    });
  };

  React.useEffect(() => {
    if (selection.length === 0) {
      setValue("_selectedPost", undefined);
    } else {
      const selected = posts.find((post) => post.id === selection[0]);
      setValue("_selectedPost", selected);
    }
  }, [posts, selection, setValue]);

  return (
    <>
      <div style={{ height: 260, width: "100%" }}>
        <DataGrid
          rows={posts}
          columns={columns}
          density="compact"
          autoPageSize
          rowsPerPageOptions={[3]}
          checkboxSelection
          selectionModel={selection}
          getRowId={(row) => row.id}
          onSelectionModelChange={onSelectionModelChange}
        />
      </div>
    </>
  );
};

export default PostTableCommponent;
