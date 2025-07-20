document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const uploadBox = document.getElementById('upload-box');
    const fileInput = document.getElementById('file-input');
    const browseButton = document.getElementById('browse-button');
    const imageQueue = document.getElementById('image-queue');
    const processingArea = document.getElementById('processing-area');
    const downloadSection = document.getElementById('download-section');
    const noDownloads = document.getElementById('no-downloads');
    const downloadGallery = document.getElementById('download-gallery');
    
    const seoPhraseInput = document.getElementById('seo-phrase');
    const outputFormatSelect = document.getElementById('output-format');
    const qualityInput = document.getElementById('quality');
    const ogTitleInput = document.getElementById('og-title');
    const ogDescriptionInput = document.getElementById('og-description');
    const slugPreview = document.getElementById('slug-preview');
    const activeImagePreview = document.getElementById('active-image-preview');
    const facebookPreview = document.getElementById('facebook-preview');
    const ogImage = document.getElementById('og-image');
    const ogTitlePreview = document.getElementById('og-title-preview');
    const ogDescriptionPreview = document.getElementById('og-description-preview');
    const optimizeButton = document.getElementById('optimize-button');
    const optimizeButtonText = document.getElementById('optimize-button-text');
    const optimizerSpinner = document.getElementById('optimizer-spinner');

    let uploadedFiles = [];
    let activeFile = null;

    // Verifica se os elementos principais existem
    if (!fileInput || !browseButton || !uploadBox) {
        console.error('Um ou mais elementos do DOM não foram encontrados.');
        return;
    }

    const slugify = (text) => {
        if (!text) return '';
        const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
        const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrssssssttuuuuuuuuuwxyyzzz------';
        const p = new RegExp(a.split('').join('|'), 'g');

        return text.toString().toLowerCase()
            .replace(/\s+/g, '-') 
            .replace(p, c => b.charAt(a.indexOf(c))) 
            .replace(/&/g, '-e-') 
            .replace(/[^\w\-]+/g, '') 
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '') 
            .replace(/-+$/, '');
    };

    const handleFiles = (files) => {
        processingArea.classList.remove('hidden');
        const newFiles = [...files].filter(file => file.type.startsWith('image/'));
        if (newFiles.length === 0) {
            alert('Nenhuma imagem válida selecionada.');
            return;
        }

        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const fileData = {
                    id: `file-${Date.now()}-${Math.random()}`,
                    file: file,
                    dataURL: e.target.result
                };
                uploadedFiles.push(fileData);
                renderImageQueue();
                if (!activeFile) {
                    setActiveFile(fileData);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const renderImageQueue = () => {
        imageQueue.innerHTML = '';
        uploadedFiles.forEach(fileData => {
            const thumbWrapper = document.createElement('div');
            thumbWrapper.className = `relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${activeFile && activeFile.id === fileData.id ? 'border-blue-500 ring-2 ring-blue-500' : 'border-transparent'}`;
            thumbWrapper.onclick = () => setActiveFile(fileData);

            const img = document.createElement('img');
            img.src = fileData.dataURL;
            img.className = 'w-full h-24 object-cover';
            
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '×';
            removeBtn.className = 'absolute top-0 right-0 bg-red-600 text-white rounded-bl-lg px-2 py-0.5 font-bold hover:bg-red-700 transition-colors';
            removeBtn.onclick = (e) => {
                e.stopPropagation();
                removeFile(fileData.id);
            };

            thumbWrapper.appendChild(img);
            thumbWrapper.appendChild(removeBtn);
            imageQueue.appendChild(thumbWrapper);
        });
    };

    const removeFile = (id) => {
        uploadedFiles = uploadedFiles.filter(f => f.id !== id);
        if (activeFile && activeFile.id === id) {
            activeFile = uploadedFiles.length > 0 ? uploadedFiles[0] : null;
            if (activeFile) {
                setActiveFile(activeFile);
            } else {
                resetWorkspace();
            }
        }
        renderImageQueue();
        if (uploadedFiles.length === 0) {
            resetWorkspace();
        }
    };

    const resetWorkspace = () => {
        processingArea.classList.add('hidden');
        activeFile = null;
        uploadedFiles = [];
        renderImageQueue();
    };

    const setActiveFile = (fileData) => {
        activeFile = fileData;
        renderImageQueue();
        
        const originalName = fileData.file.name.split('.').slice(0, -1).join('.');
        if (seoPhraseInput.value.trim() === '') {
            seoPhraseInput.value = originalName.replace(/[-_]/g, ' ');
        }
        updateSlugPreview();
        if (ogTitleInput.value.trim() === '') {
            ogTitleInput.value = seoPhraseInput.value;
        }
        activeImagePreview.src = fileData.dataURL;
        ogImage.src = fileData.dataURL;
        updateOgPreview();
    };

    const updateSlugPreview = () => {
        const slug = slugify(seoPhraseInput.value);
        slugPreview.textContent = `${slug}`;
    };

    const updateOgPreview = () => {
        ogTitlePreview.textContent = ogTitleInput.value || 'Título da sua Publicação';
        ogDescriptionPreview.textContent = ogDescriptionInput.value || 'A descrição da sua publicação aparecerá aqui, mostrando como atrairá cliques.';
    };

    const processAllAndDownload = async () => {
        if (uploadedFiles.length === 0) {
            alert('Nenhuma imagem na fila para otimizar.');
            return;
        }

        optimizeButton.disabled = true;
        optimizeButtonText.classList.add('hidden');
        optimizerSpinner.classList.remove('hidden');

        const baseSlug = slugify(seoPhraseInput.value) || 'imagem-otimizada';
        const outputFormat = outputFormatSelect.value;
        const quality = outputFormat === 'image/png' ? undefined : Math.min(Math.max(parseInt(qualityInput.value), 1), 100) / 100;
        const fileExtension = outputFormat === 'image/png' ? 'png' : outputFormat === 'image/jpeg' ? 'jpg' : 'webp';
        const filesToProcess = [...uploadedFiles];

        const processingPromises = filesToProcess.map((fileData, index) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    let fileName = `${baseSlug}.${fileExtension}`;
                    if (filesToProcess.length > 1) {
                        fileName = `${baseSlug}-${index + 1}.${fileExtension}`;
                    }

                    canvas.toBlob(blob => {
                        const optimizedData = {
                            id: `optimized-${Date.now()}-${index}`,
                            blob: blob,
                            fileName: fileName,
                            dataURL: URL.createObjectURL(blob)
                        };
                        resolve(optimizedData);
                    }, outputFormat, quality);
                };
                img.onerror = reject;
                img.src = fileData.dataURL;
            });
        });

        try {
            const allOptimizedData = await Promise.all(processingPromises);
            allOptimizedData.forEach(addOptimizedToGallery);
            resetWorkspace();
        } catch (error) {
            console.error("Erro ao processar imagens:", error);
            alert("Ocorreu um erro ao processar as imagens. Tente novamente.");
        } finally {
            optimizeButton.disabled = false;
            optimizeButtonText.classList.remove('hidden');
            optimizerSpinner.classList.add('hidden');
        }
    };

    const addOptimizedToGallery = (optimizedData) => {
        downloadSection.classList.remove('hidden');
        noDownloads.classList.add('hidden');

        const card = document.createElement('div');
        card.className = 'bg-slate-50 rounded-lg p-4 flex flex-col items-center text-center space-y-3 preview-card';

        const img = document.createElement('img');
        img.src = optimizedData.dataURL;
        img.className = 'w-full h-40 object-cover rounded-md';

        const fileNameP = document.createElement('p');
        fileNameP.className = 'font-mono text-xs break-all text-slate-700';
        fileNameP.textContent = optimizedData.fileName;

        const downloadBtn = document.createElement('a');
        downloadBtn.href = optimizedData.dataURL;
        downloadBtn.download = optimizedData.fileName;
        downloadBtn.className = 'w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm';
        downloadBtn.textContent = 'Baixar';

        card.appendChild(img);
        card.appendChild(fileNameP);
        card.appendChild(downloadBtn);

        downloadGallery.appendChild(card);
    };

    uploadBox.addEventListener('click', () => {
        console.log('Upload box clicado');
        fileInput.click();
    });
    browseButton.addEventListener('click', () => {
        console.log('Botão Selecionar Ficheiros clicado');
        fileInput.click();
    });
    fileInput.addEventListener('change', (e) => {
        console.log('Arquivos selecionados:', e.target.files);
        handleFiles(e.target.files);
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadBox.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadBox.addEventListener(eventName, () => uploadBox.classList.add('dragover'), false);
    });
    ['dragleave', 'drop'].forEach(eventName => {
        uploadBox.addEventListener(eventName, () => uploadBox.classList.remove('dragover'), false);
    });
    uploadBox.addEventListener('drop', (e) => {
        console.log('Arquivos soltos:', e.dataTransfer.files);
        handleFiles(e.dataTransfer.files);
    });

    seoPhraseInput.addEventListener('input', updateSlugPreview);
    ogTitleInput.addEventListener('input', updateOgPreview);
    ogDescriptionInput.addEventListener('input', updateOgPreview);
    optimizeButton.addEventListener('click', processAllAndDownload);
});
