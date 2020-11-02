import * as React from 'react';
import { fetchSearch } from '../../api/api';
import { CsgoUser, SteamSearchResponse } from '../../api/types';

const { useState, useEffect } = React;

type Props = {
	onSubmit: (value: string) => void;
};

const SteamInput = (props: Props) => {
	const [value, setValue] = useState<string>('');
	const [csgoUsers, setCsgoUsers] = useState<CsgoUser[]>([]);

	const fetchData = async (q: string) => {
		const response: SteamSearchResponse = await fetchSearch(q);

		if (response.error) {
			window.alert('error');
			return;
		}

		const { searchResult } = response;
		setCsgoUsers(searchResult);
	};

	const userComponents = csgoUsers.map((user) => (
		<div
			id={user.id}
			className="my-2 cursor-pointer bg-gray-700 p-2 rounded"
			onClick={() => {
				window.history.pushState(
					undefined,
					'Steam profile',
					`/steam?id=${user.id}`,
				);
				props.onSubmit(user.id);
			}}
		>
			<span className="text-gray-100 text-xl">{user.name}</span>
			<span className="ml-2 text-gray-500 text-sm">{user.id}</span>
		</div>
	));

	return (
		<div className="flex flex-col border-solid border-2 border-gray-800 m-4 p-4">
			<div className="flex flex-row">
				<input
					onChange={(evt) => {
						const q: string = evt.target.value;
						setValue(q);
						fetchData(q);
					}}
					placeholder="Player name..."
					value={value}
					className="flex-1 p-1"
				/>
			</div>
			<div className="flex flex-col">{userComponents}</div>
		</div>
	);
};

export default SteamInput;