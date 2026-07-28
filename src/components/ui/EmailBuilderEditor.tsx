import { useRef, useEffect, forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import UnlayerEmailEditor from 'react-email-editor';
import { EditorRef, EmailEditorProps } from 'react-email-editor';
import { toast } from 'sonner';
import { Code, Copy, X } from 'lucide-react';
import { Button } from './button';

interface SyntaxHighlightedCodeProps {
	code: string;
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	onFocus: () => void;
	minHeight: string;
}

/**
 * Syntax Highlighted Code Component
 */
const SyntaxHighlightedCode = ({ code, onChange, onFocus, minHeight }: SyntaxHighlightedCodeProps) => {
	const [highlightedCode, setHighlightedCode] = useState('');
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const preRef = useRef<HTMLPreElement>(null);

	const highlightHTML = useCallback((html: string) => {
		// Just escape HTML and apply basic coloring without complex regex
		let result = html
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#x27;');

		// Simple highlighting - just color the basic elements
		result = result
			// HTML tags - color the entire tag structure
			.replace(
				/(&lt;\/?)([a-zA-Z][a-zA-Z0-9-]*)([^&]*?)(&gt;)/g,
				'<span style="color: #569cd6;">$1$2</span><span style="color: #92c5f8;">$3</span><span style="color: #569cd6;">$4</span>'
			)
			// Attribute values in quotes (simple pattern)
			.replace(/=(&quot;[^&]*?&quot;)/g, '=<span style="color: #ce9178;">$1</span>')
			// Comments
			.replace(/(&lt;!--.*?--&gt;)/gs, '<span style="color: #6a9955;">$1</span>');

		return result;
	}, []);

	useEffect(() => {
		const highlighted = highlightHTML(code);
		setHighlightedCode(highlighted);
	}, [code, highlightHTML]);

	// Sync scroll between container and line numbers
	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const scrollTop = (e.target as HTMLDivElement).scrollTop;

		if (preRef.current && preRef.current.parentElement) {
			const lineNumbers = preRef.current.parentElement.querySelector('.line-numbers') as HTMLElement;
			if (lineNumbers) {
				lineNumbers.style.transform = `translateY(${-scrollTop}px)`;
			}
		}
	};

	// Handle tab key for indentation
	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Tab') {
			e.preventDefault();
			const target = e.target as HTMLTextAreaElement;
			const start = target.selectionStart;
			const end = target.selectionEnd;
			const newValue = code.substring(0, start) + '  ' + code.substring(end);
			onChange({ target: { value: newValue } } as React.ChangeEvent<HTMLTextAreaElement>);

			// Restore cursor position
			setTimeout(() => {
				target.selectionStart = target.selectionEnd = start + 2;
			}, 0);
		}
	};

	const lineCount = code.split('\n').length;
	const lineNumberWidth = Math.max(2, lineCount.toString().length) * 8 + 16;

	return (
		<div
			className="relative w-full bg-gray-900 overflow-auto"
			style={{ minHeight, maxHeight: minHeight }}
			onScroll={handleScroll}
		>
			{/* Line numbers */}
			<div
				className="line-numbers absolute left-0 top-0 bg-gray-800 border-r border-gray-700 text-gray-400 font-mono text-xs select-none pointer-events-none z-10"
				style={{
					width: `${lineNumberWidth}px`,
					padding: '16px 8px',
					lineHeight: '1.5',
					fontSize: '13px',
					fontFamily: 'Consolas, "Courier New", monospace',
				}}
			>
				{code.split('\n').map((_, index) => (
					<div key={index}>{index + 1}</div>
				))}
			</div>

			<pre
				ref={preRef}
				className="relative font-mono text-sm whitespace-pre-wrap break-words pointer-events-none z-20 block"
				style={{
					minHeight,
					lineHeight: '1.5',
					tabSize: 2,
					fontSize: '13px',
					fontFamily: 'Consolas, "Courier New", monospace',
					paddingLeft: `${lineNumberWidth + 8}px`,
					paddingTop: '16px',
					paddingRight: '16px',
					paddingBottom: '16px',
					color: '#d4d4d4', // Default text color
					margin: 0,
				}}
				dangerouslySetInnerHTML={{ __html: highlightedCode }}
			/>

			<textarea
				ref={textareaRef}
				value={code}
				onChange={onChange}
				onFocus={onFocus}
				onKeyDown={handleKeyDown}
				className="absolute inset-0 w-full h-full font-mono text-sm bg-transparent text-transparent focus:outline-none resize-none overflow-hidden z-30"
				style={{
					lineHeight: '1.5',
					tabSize: 2,
					fontSize: '13px',
					fontFamily: 'Consolas, "Courier New", monospace',
					paddingLeft: `${lineNumberWidth + 8}px`,
					paddingTop: '16px',
					paddingRight: '16px',
					paddingBottom: '16px',
					caretColor: '#ffffff',
				}}
				spellCheck="false"
				placeholder=""
				autoComplete="off"
				autoCorrect="off"
				autoCapitalize="off"
			/>
		</div>
	);
};

export interface EmailBuilderEditorRef {
	exportHtml: () => Promise<{ html: string; designJson: any }>;
	saveDesign: () => Promise<any>;
	loadDesign: (design: any) => void;
	getEditorInstance: () => any;
}

interface EmailBuilderEditorProps {
	designJson?: any;
	html?: string;
	minHeight?: string;
	options?: any;
	onChange?: (hasContent: boolean) => void;
}

/**
 * Reusable Email Builder Component
 *
 * @param {Object} props
 * @param {Object} props.designJson - Initial design JSON to load (optional)
 * @param {string} props.html - Initial HTML to display (optional)
 * @param {string} props.minHeight - Minimum height of the editor (default: '600px')
 * @param {Object} props.options - Additional Unlayer editor options
 * @param {Function} props.onChange - Callback when editor content changes with hasContent boolean (optional)
 */
const EmailBuilderEditor = forwardRef<EmailBuilderEditorRef, EmailBuilderEditorProps>(
	({ designJson = null, html = null, minHeight = '600px', options = {}, onChange }, ref) => {
		const emailEditorRef = useRef<EditorRef>(null);
		const isLoadedRef = useRef(false);
		const designJsonRef = useRef<any>(designJson);
		const [showHtmlModal, setShowHtmlModal] = useState(false);
		const [currentHtml, setCurrentHtml] = useState(html || '');
		const [copyButtonText, setCopyButtonText] = useState('Copy HTML');
		const [isEditorReady, setIsEditorReady] = useState(false);

		// Update ref when designJson prop changes
		useEffect(() => {
			console.log('EmailBuilderEditor - designJson prop changed:', {
				hasDesignJson: !!designJson,
				designJsonType: typeof designJson,
				designJsonLength: typeof designJson === 'string' ? designJson.length : JSON.stringify(designJson || {}).length,
			});
			
			designJsonRef.current = designJson;
			// Reset loaded flag when designJson changes to allow reloading
			isLoadedRef.current = false;
			
			// If editor is already ready, load the design immediately
			if (designJson && emailEditorRef.current?.editor) {
				loadDesignIntoEditor(designJson);
			}
		}, [designJson]);

		// Helper function to load design into editor
		const loadDesignIntoEditor = (design: any) => {
			const unlayer = emailEditorRef.current?.editor;
			if (!unlayer || isLoadedRef.current) {
				console.log('EmailBuilderEditor - Skipping load:', { 
					hasEditor: !!unlayer, 
					alreadyLoaded: isLoadedRef.current 
				});
				return;
			}

			try {
				const designData = typeof design === 'string' ? JSON.parse(design) : design;
				console.log('EmailBuilderEditor - Loading design into editor:', { 
					hasDesignData: !!designData,
					designKeys: Object.keys(designData || {})
				});

				unlayer.loadDesign(designData);
				isLoadedRef.current = true;
				console.log('EmailBuilderEditor - Design loaded successfully');
			} catch (err) {
				console.error('EmailBuilderEditor - Error loading design:', err);
				toast.error('Failed to load template design');
			}
		};

		// Expose methods to parent component
		useImperativeHandle(ref, () => ({
			exportHtml: () => {
				return new Promise<{ html: string; designJson: any }>((resolve, reject) => {
					const unlayer = emailEditorRef.current?.editor;
					if (!unlayer) {
						reject(new Error('Editor not ready'));
						return;
					}

					unlayer.exportHtml((data) => {
						const { design, html } = data;
						resolve({ html, designJson: design });
					});
				});
			},
			saveDesign: () => {
				return new Promise<any>((resolve, reject) => {
					const unlayer = emailEditorRef.current?.editor;
					if (!unlayer) {
						reject(new Error('Editor not ready'));
						return;
					}

					unlayer.saveDesign((design: any) => {
						resolve(design);
					});
				});
			},
			loadDesign: (design: any) => {
				const unlayer = emailEditorRef.current?.editor;
				if (unlayer && design) {
					unlayer.loadDesign(design);
				}
			},
			getEditorInstance: () => {
				return emailEditorRef.current?.editor;
			},
		}));

		// Update currentHtml when html prop changes
		useEffect(() => {
			if (html) {
				setCurrentHtml(html);
			}
		}, [html]);

		// Handle showing HTML preview
		const handleShowHtml = async () => {
			try {
				const unlayer = emailEditorRef.current?.editor;
				if (!unlayer) {
					toast.error('Editor not ready');
					return;
				}

				unlayer.exportHtml((data) => {
					setCurrentHtml(data.html);
					setShowHtmlModal(true);
				});
			} catch (err) {
				console.error('Error exporting HTML:', err);
				toast.error('Failed to export HTML');
			}
		};

		// Handle copying HTML to clipboard
		const handleCopyHtml = async () => {
			try {
				await navigator.clipboard.writeText(currentHtml);
				setCopyButtonText('Copied!');

				// Reset button text after 2 seconds
				setTimeout(() => {
					setCopyButtonText('Copy HTML');
				}, 2000);
			} catch (err) {
				console.error('Error copying to clipboard:', err);
				toast.error('Failed to copy HTML');
			}
		};

		const onReady: EmailEditorProps['onReady'] = (unlayer) => {
			console.log('EmailBuilderEditor - Editor ready, checking for design to load');
			
			// Mark editor as ready
			setIsEditorReady(true);
			
			// Configure image upload to use base64
			unlayer.registerCallback('image', (file: any, done: any) => {
				const reader = new FileReader();
				reader.onloadend = () => {
					done({ progress: 100, url: reader.result });
				};
				reader.onerror = () => {
					toast.error('Failed to convert image to base64');
					done({ progress: 0 });
				};
				reader.readAsDataURL(file.attachments[0]);
			});

			// Set default body background color to white
			unlayer.setBodyValues({
				backgroundColor: '#FFFFFF',
			});

			// Listen for design changes to notify parent
			if (onChange) {
				unlayer.addEventListener('design:updated', () => {
					// Check if design has content by saving and inspecting it
					unlayer.saveDesign((design: any) => {
						const hasContent = design?.body?.rows && design.body.rows.length > 0 && 
							design.body.rows.some((row: any) => 
								row.columns && row.columns.length > 0 && 
								row.columns.some((col: any) => col.contents && col.contents.length > 0)
							);
						onChange(hasContent);
					});
				});
			}

			// Load design if provided and not already loaded
			if (designJsonRef.current && !isLoadedRef.current) {
				console.log('EmailBuilderEditor - Loading design on editor ready');
				// Small delay to ensure editor is fully initialized
				setTimeout(() => {
					loadDesignIntoEditor(designJsonRef.current);
				}, 300);
			}
		};

		return (
			<div className="email-builder-wrapper">
				{/* View HTML Button */}
				<div className="mb-3 flex justify-end">
					<Button 
						onClick={handleShowHtml} 
						variant="default" 
						size="sm" 
						type="button" 
						className="flex items-center gap-2"
						disabled={!isEditorReady}
					>
						<Code size={16} />
						{isEditorReady ? 'View HTML' : 'Loading...'}
					</Button>
				</div>

				{/* HTML Preview Modal */}
				{showHtmlModal && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
						<div className="bg-popover rounded-lg shadow-xl w-[90vw] h-[90vh] flex flex-col">
							{/* Modal Header */}
							<div className="flex items-center justify-between p-4 border-b border-border">
								<h2 className="text-xl font-semibold text-popover-foreground">Email Template HTML</h2>
								<div className="flex items-center gap-2">
									<Button onClick={handleCopyHtml} variant="default" size="sm" type="button" className="flex items-center gap-2">
										<Copy size={16} />
										{copyButtonText}
									</Button>
									<Button onClick={() => setShowHtmlModal(false)} variant="default" size="sm" type="button">
										<X size={20} />
									</Button>
								</div>
							</div>

							{/* Modal Body */}
							<div className="flex-1 overflow-hidden">
								<SyntaxHighlightedCode
									code={currentHtml}
									onChange={(e) => setCurrentHtml(e.target.value)}
									onFocus={() => {}}
									minHeight="100%"
								/>
							</div>
						</div>
					</div>
				)}

				<div
					style={{
						height: minHeight,
						border: '1px solid #e5e7eb',
						borderRadius: '0.375rem',
						overflow: 'hidden',
					}}
				>
					<UnlayerEmailEditor
						ref={emailEditorRef}
						onReady={onReady}
						minHeight={minHeight}
						options={{
							displayMode: 'email',
							features: {
								textEditor: {
									spellChecker: true,
								},
							},
							tools: {
								image: {
									enabled: true,
								},
							},
							appearance: {
								theme: 'light',
							},
							bodyValues: {
								backgroundColor: '#FFFFFF',
							},
							...options,
						}}
					/>
				</div>
			</div>
		);
	}
);

EmailBuilderEditor.displayName = 'EmailBuilderEditor';

export default EmailBuilderEditor;
