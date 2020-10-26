import * as React from 'react';
import { sendImage } from '../../api/api';
import { ImageRouteResponse } from '../../api/types';
import TextInput from '../utils/TextInput';

const { useState, useEffect } = React;

type Props = {
	onUpdate: (response: ImageRouteResponse) => void;
};

const ImageUpload = (props: Props) => {
	const [name, setName] = useState<string>('');
	const [link, setLink] = useState<string>('');
	const [previewLink, setPreviewLink] = useState<string>('');
	const [refreshTimeout, setRefreshTimeout] = useState<NodeJS.Timeout>();

	const sendImageAndUpdateSubmissions = async () => {
		if (!name.includes('.')) {
			window.alert(
				`The image name ${name} doesn't seem to have a file ending (e.g. .PNG)!`,
			);
			return;
		}

		const response: ImageRouteResponse = await sendImage(name, link);
		if (!response.error) {
			setName('');
			setLink('');
			shouldRefreshPreviewImage('');
		}
		props.onUpdate(response);
	};

	const shouldRefreshPreviewImage = (newLink: string) => {
		if (refreshTimeout !== undefined) {
			clearTimeout(refreshTimeout);
		}

		const timeout: NodeJS.Timeout = setTimeout(() => {
			setPreviewLink(newLink);
		}, 1000);

		setRefreshTimeout(timeout);
	};

	const imgSrcLink: string =
		previewLink === undefined
			? 'http://via.placeholder.com/500x500'
			: previewLink;

	return (
		<div className="flex flex-row border-solid border-2 border-gray-800 p-4 m-4">
			<div className="flex flex-col flex-1">
				<span className="text-gray-500">New submission</span>
				<TextInput
					title="Name"
					value={name}
					onChange={(str) => setName(str)}
				/>
				<TextInput
					title="Link"
					value={link}
					onChange={(str) => {
						setLink(str);
						shouldRefreshPreviewImage(str);
					}}
				/>
			</div>
			<div className="flex flex-col justify-center items-center mx-16">
				<img className="w-30 h-20 rounded mb-4" src={imgSrcLink} />
				<button
					className="bg-blue-500 px-6 py-1 rounded text-gray-200"
					onClick={() => sendImageAndUpdateSubmissions()}
				>
					Submit
				</button>
			</div>
		</div>
	);
};

export default ImageUpload;
