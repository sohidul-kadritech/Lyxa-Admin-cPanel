/* eslint-disable no-unsafe-optional-chaining */
import { Close, Edit, Visibility } from '@mui/icons-material';
import { Stack } from '@mui/material';
import { useRef, useState } from 'react';
import { ReactComponent as HandleIcon } from '../../../../../assets/icons/handle.svg';
// eslint-disable-next-line import/no-named-as-default
import StyledIconButton from '../../../../../components/Styled/StyledIconButton';
import StyledInput from '../../../../../components/Styled/StyledInput';
import StyledSwitch from '../../../../../components/Styled/StyledSwitch';

export default function CategoryItem({ category, onSave, onDelete, isAddNew, onViewShops, setGlobalChange }) {
  const [render, setRender] = useState(false);
  const [editMode, setEditMode] = useState(isAddNew);
  const inputRef = useRef();

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" pb={1.5} pt={1.5}>
      <Stack alignItems="center" direction="row" gap="30px">
        <HandleIcon className="grabable drag-handler" />
        <StyledInput
          ref={inputRef}
          value={category?.name}
          autoFocus={isAddNew}
          readOnly={!editMode}
          sx={{
            width: 'auto',

            '& input': {
              maxWidth: '200px',
              width: `max(${(category?.name?.length + 1) * 8}px, 20px)`,
              fontSize: '13px',
              textAlign: 'center',
              padding: '14px 28px',
            },
          }}
          onBlur={() => {
            onSave(
              category,
              () => {
                setEditMode(false);
              },
              {
                isAddNew,
                isClickOutside: true,
              }
            );
          }}
          onChange={(event) => {
            category.name = event.target.value;
            setRender((prev) => !prev);
            setGlobalChange(true);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onSave(
                category,
                (status) => {
                  setEditMode(status);
                  inputRef?.current?.querySelector('input')?.blur();
                },
                {
                  isAddNew,
                }
              );
            }
          }}
        />
      </Stack>
      {/* right */}
      {!isAddNew && (
        <Stack direction="row" justifyContent="flex-end" gap={11}>
          <StyledSwitch
            checked={category?.status === 'active'}
            onChange={(event) => {
              category.status = event.target.checked ? 'active' : 'inactive';
              setRender(!render);
              setGlobalChange(true);
            }}
          />
          <Stack direction="row" gap={2.5}>
            <StyledIconButton
              color="secondary"
              onClick={() => {
                onViewShops(category);
              }}
            >
              <Visibility />
            </StyledIconButton>
            <StyledIconButton
              color="secondary"
              onClick={() => {
                setEditMode(true);
                setTimeout(() => {
                  inputRef?.current?.querySelector('input')?.focus();
                }, 10);
              }}
            >
              <Edit />
            </StyledIconButton>
            <StyledIconButton
              color="secondary"
              onClick={() => {
                onDelete(category);
                setGlobalChange(true);
              }}
            >
              <Close />
            </StyledIconButton>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
