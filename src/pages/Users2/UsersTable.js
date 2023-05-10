/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import {Close, Edit} from '@mui/icons-material';
import {
	// eslint-disable-next-line prettier/prettier
	Box,
	Button,
	Drawer,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	styled,
	tableCellClasses,
	useTheme,
} from '@mui/material';
import React, {Fragment, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import ConfirmModal from '../../components/Common/ConfirmModal';
import TableLoader from '../../components/Common/TableLoader';
import EditUser from './EditUser';
import UserTablePageSkeleton from './UserTableSkeleton';

const cols = [
	{
		label: 'NAME',
		align: 'left',
	},
	{
		label: 'EMAIL',
		align: 'left',
	},
	{
		label: 'ACTION',
		align: 'right',
	},
];
const StyledTableRow = styled(TableRow)(() => ({
	td: {
		paddingLeft: '0px',
		borderBottom: '1px dashed #E4E6EF',
	},
	'&:last-child td, &:last-child th': {
		border: 0,
	},
}));

const StyledTableCell = styled(TableCell)(({theme}) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.primary.contrastText,
		color: theme.palette.text.secondary2,
		fontWeight: 600,
		paddingLeft: '0px',
		paddingTop: '0px',
		borderBottom: '1px dashed #E4E6EF',
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

function UsersTable({data, loading, isConfirm, isEditOpen, ...props}) {
	const shop = useSelector((store) => store.Login.admin);

	const credentialUserId = shop.credentialUserId || shop._id;

	const theme = useTheme();

	// const [open, setOpen] = useState(false);

	const [editableData, setEditableData] = useState({});

	const [credentialData, setCredentialData] = useState(undefined);

	const [removedUserId, setRemoveUserId] = useState('');

	// const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

	useEffect(() => {
		const credentialUser = data.find((item) => item._id === credentialUserId);
		setCredentialData(() => credentialUser || undefined);
	}, [data]);

	const removeCredential = (id) => {
		props.RemoveUserHandler({shopId: id});
	};

	// useEffect(() => {
	//   if (loading === false) {
	//     setOpen(false);
	//   }
	// }, [loading]);

	return (
		<Box>
			<TableContainer
				component={Paper}
				sx={{padding: '20px', border: '1px solid #E4E6EF', borderRadius: '7px', marginTop: '35px'}}
			>
				{loading || data.length <= 0 ? (
					<UserTablePageSkeleton />
				) : (
					<Table
						sx={{minWidth: 700}}
						aria-label="customized table"
					>
						<TableHead>
							<TableRow>
								{cols.map((data, i) => (
									<StyledTableCell
										align={data.align}
										key={i}
									>
										{data.label}
									</StyledTableCell>
								))}
							</TableRow>
						</TableHead>
						{loading ? (
							<TableBody>
								<TableLoader />
							</TableBody>
						) : (
							<TableBody>
								{credentialData && (
									<StyledTableRow>
										<StyledTableCell component="td">{credentialData?.name}</StyledTableCell>
										<StyledTableCell align="left">{credentialData?.email}</StyledTableCell>
										<StyledTableCell align="right">
											<Stack
												flexDirection="row"
												justifyContent="end"
												gap="10px"
											>
												<Button
													onClick={() => {
														setEditableData(credentialData);
														props.openEditSideBar();
													}}
													sx={{
														minWidth: '32px',
														padding: '9px',
														height: '32px',
														borderRadius: '6px',
														display: 'flex',
														justifyContent: 'center',
														alignContent: 'center',
														background: theme.palette.background.secondary,
													}}
												>
													<Edit sx={{fontSize: '14px'}} />
												</Button>
												<Button
													onClick={() => removeCredential(credentialData?._id)}
													disabled
													sx={{
														minWidth: '32px',
														padding: '9px',
														height: '32px',
														borderRadius: '6px',
														display: 'flex',
														justifyContent: 'center',
														alignContent: 'center',
														background: theme.palette.background.secondary,
													}}
												>
													<Close sx={{fontSize: '14px'}} />
												</Button>
											</Stack>
										</StyledTableCell>
									</StyledTableRow>
								)}
								{data.length > 0 ? (
									data.map((row, i) => (
										<Fragment key={i}>
											{row._id !== credentialData?._id && (
												<StyledTableRow>
													<StyledTableCell component="td">{row?.name}</StyledTableCell>
													<StyledTableCell align="left">{row?.email}</StyledTableCell>
													<StyledTableCell align="right">
														<Stack
															flexDirection="row"
															justifyContent="end"
															gap="10px"
														>
															<Button
																onClick={() => {
																	setEditableData(row);
																	props.openEditSideBar();
																}}
																sx={{
																	minWidth: '32px',
																	padding: '9px',
																	height: '32px',
																	borderRadius: '6px',
																	display: 'flex',
																	justifyContent: 'center',
																	alignContent: 'center',
																	background: theme.palette.background.secondary,
																}}
															>
																<Edit sx={{fontSize: '14px'}} />
															</Button>
															<Button
																onClick={() => {
																	setRemoveUserId(row._id);
																	props.openConfirmModal();
																}}
																// onClick={() => removeCredential(row?._id)}
																disabled={shop._id === row._id}
																sx={{
																	minWidth: '32px',
																	padding: '9px',
																	height: '32px',
																	borderRadius: '6px',
																	display: 'flex',
																	justifyContent: 'center',
																	alignContent: 'center',
																	background: theme.palette.background.secondary,
																}}
															>
																<Close sx={{fontSize: '14px'}} />
															</Button>
														</Stack>
													</StyledTableCell>
												</StyledTableRow>
											)}
										</Fragment>
									))
								) : (
									<StyledTableRow>
										{' '}
										<Stack
											height="100%"
											width="100%"
											alignItems="center"
											justifyContent="center"
										>
											<Typography sx={{textAlign: 'center', fontSize: '24px', fontWeight: 700}}>
												No user credential
											</Typography>
										</Stack>
										{/* <Typography>No user credential</Typography> */}
									</StyledTableRow>
								)}
							</TableBody>
						)}
					</Table>
				)}
			</TableContainer>
			<Drawer
				open={isEditOpen}
				anchor="right"
			>
				<EditUser
					loading={props?.editUserLoading}
					editUserHandler={props.editUserHandler}
					onClose={() => props.closeEditSidebar()}
					data={editableData}
				/>
			</Drawer>

			<ConfirmModal
				message="Are you confirm to remove the user?"
				isOpen={isConfirm}
				loading={props.deleteUserLoading}
				blurClose
				onCancel={() => {
					props.closeConfirmModal();
				}}
				onConfirm={() => {
					removeCredential(removedUserId);
					// setIsConfirmModalOpen(false);
				}}
			/>
		</Box>
	);
}

export default UsersTable;
