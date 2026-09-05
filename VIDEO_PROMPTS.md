# イロハデザイン｜Geminiに渡す動画プロンプト

まずは **01のトップ動画を1本** つくるのがおすすめです。完成済みのトップ画像を参照画像として添付し、下のプロンプトをそのままコピーしてください。参照画像は `assets/architecture.webp` です。

このHPは「静かな建築映画」がコンセプトです。派手なカメラワークより、光・水・木々のわずかな動きが効きます。文字やロゴはHP側で重ねるため、動画には入れません。

## 01｜トップ：森の静けさと、家の灯り【最優先】

添付する参照画像：`assets/architecture.webp`

以下を丸ごとGeminiへ：

```text
添付した建築画像を参照して、日本の建築設計事務所「イロハデザイン」のWebサイトのトップに使う、静かで上質な建築映像を1本生成してください。実在の施工事例の再現ではなく、ブランドの世界観を伝える架空のコンセプト映像です。

Visual direction:
A premium, photorealistic architectural film. A low, horizontal contemporary Japanese residence sits quietly within a dense forest at blue hour. Pale board-marked concrete, dark timber slats, floor-to-ceiling glazing, warm amber interior light, natural stone, and a shallow reflecting pool. Preserve the exact architecture, openings, roofline, proportions, materials, and forest arrangement in the reference image. Calm, atmospheric, materially believable, editorial architectural photography brought to life.

Composition:
Landscape 16:9. Keep the house mainly in the right two-thirds of the frame. Keep the left third as dark, uncluttered forest and soft shadow, suitable for white Japanese headline text that will be added separately on the website. Do not generate any text. Do not crop off the main roof edge. The warm interior must remain visible and stable.

Motion:
8 seconds if available. Use a locked-off camera with absolutely no camera shake and no cuts. Create motion only through subtle wind in a few leaves and almost imperceptible natural ripples across the reflecting pool. Architectural lines, glass, furniture, and lights remain perfectly stable. No flickering light. No dramatic movement. The feeling should be of standing still and noticing that the landscape is alive.

Loop:
Design for a seamless continuous loop. The first and last frames should match in exposure, composition, object positions, and lighting. Avoid irreversible actions, objects entering or exiting, changing weather, sunrise, sunset, or a large wave moving across the entire frame. Preserve a constant blue-hour sky.

Color and finish:
Deep charcoal green forest, cool natural stone, restrained amber light. Rich but readable shadows, realistic glass reflections, subtle material texture. No teal-and-orange commercial grade, no exaggerated saturation, no HDR halos, no artificial film scratches. High resolution, ideally 4K if available, otherwise the highest available resolution. Natural 24 fps cinematic motion if selectable. No audio is needed.

Exclude:
People, animals, cars, smoke, fire, heavy fog, rain, snow, neon, logos, subtitles, typography, watermarks, letterbox bars, lens flares, sudden focus changes, zooms, drones, orbiting cameras, moving walls, morphing rooflines, melting geometry, duplicated objects, and changes to the reference architecture.

Output only the finished video. Do not make a storyboard or a video of a website screen.
```

## 02｜中盤：光が住まいをつくる【2本目】

添付する参照画像：`assets/interior.webp`

```text
添付画像を参照して、日本の建築設計事務所のWebサイトに挿入する、架空の住宅の上質な室内映像を1本生成してください。建物や家具の形を勝手に変えず、参照画像の空間をそのまま保ってください。

Create a photorealistic, quiet architectural film of this contemporary Japanese interior. Natural cedar floor and timber ceiling, warm plaster walls, a low sculptural wooden table, and a full-height opening toward a lush maple courtyard. Preserve all geometry, joinery, furniture, material surfaces, and openings from the reference image.

Use a landscape 16:9 composition, 8 seconds if available. The camera is locked in place at a seated human eye level. No cuts, no zoom, no camera motion. The only movement is a very gentle breeze in the garden leaves outside, producing extremely subtle organic movement in the dappled sunlight on the floor. The room itself remains perfectly still. The shadows must respond plausibly to the moving leaves; do not simulate an accelerated sun or a time-lapse.

Aim for the feeling of an unhurried afternoon at home: tactile wood grain, softly glowing plaster, believable reflections, natural warm daylight and deep but readable shade. Leave the lower-left portion visually calm so white Japanese text can be overlaid later. Do not render that text.

The first and last frames should join seamlessly into a loop. Keep exposure and white balance absolutely constant. Render at the highest available resolution, ideally 4K; use cinematic 24 fps if selectable. No audio needed.

No people, pets, moving furniture, opening doors, curtains appearing from nowhere, smoke, floating dust effects, glossy artificial surfaces, oversaturation, lens flares, text, logos, watermarks, black bars, morphing architecture, bending walls, or changing window frames. Output the finished video, not a storyboard or an interface mockup.
```

## 03｜工房：手を動かす時間【将来の紹介映像用】

これは自動再生の背景ではなく、将来の「私たちのつくりかた」紹介動画用です。手仕事の実写素材が用意できる場合は、その映像を優先すると工房への信頼につながります。生成する場合は実際のスタッフ・現場の記録と混同しない扱いにします。

```text
日本の建築設計工房の思想を表現する、架空の手仕事のコンセプト映像を生成してください。実在の建築士、社員、工房や現場の記録ではありません。

A single continuous cinematic macro shot of an anonymous craftsperson's hands slowly placing one small, precisely cut cedar piece into a simple architectural study model on a dark wooden workbench. Show only hands and the model, with no faces. Natural side light from a large workshop window. A few real material samples — unfinished cedar, a small plaster sample, and dark stone — sit quietly out of focus in the background. The atmosphere is thoughtful, precise, and calm, like an independent architectural documentary.

Landscape 16:9, 8 seconds if available. A locked-off close camera with a 50mm-equivalent natural perspective and shallow but realistic depth of field. One simple action: the hands gently lower one piece into place, release it, and pause. No cuts and no looping requirement. The model remains dimensionally stable; the piece must fit correctly. Hands must be anatomically correct with exactly five fingers per visible hand and no interpenetration of the model.

Natural muted wood and charcoal colors, soft warm daylight, tactile grain and honest imperfections. No glossy commercial styling, dramatic music, exaggerated dust, speed ramps, floating objects, extra hands, changing tools, text, logos, watermarks, black bars, camera shake, or architectural morphing. Highest available resolution, ideally 4K. No audio needed. Output the final video only.
```

## スマホ用にもう1本作る場合

01のプロンプトの「Composition」を以下に置き換えます。その他の指示はそのまま使えます。

```text
Portrait 9:16 for a mobile website hero. Keep the architectural identity of the reference image. Place the warm glazed interior in the middle-right and lower-right of the frame. Leave the upper-left and middle-left as dark forest negative space for a Japanese headline to be overlaid later. Keep the roofline straight and continuous, and retain enough foreground to see the reflecting pool. Do not merely stretch a landscape image into portrait. No text in the generated video.
```

## できた動画をHPへ入れる

1. まず01の動画をMP4にして、`assets/hero.mp4` として保存します。
2. `site.config.js` の `heroVideo: ''` を `heroVideo: './assets/hero.mp4'` に変更します。
3. `npm run build` で公開用の内容を更新します。公開サイトは再公開が必要です。

現在の実装は01の動画用です。ミュート・ループ・インライン再生、停止ボタン、画面外での再生停止、読み込み失敗時の静止画表示を用意しています。動きを減らす設定では自動再生せず、再生ボタンから開始できます。

02・03・スマホ専用動画は素材を見てから組み込みます。生成後の画質やつなぎ目を確認し、Web掲載版は目安として1080p・数MB程度に圧縮し、4K原本は別に保管してください。

## 採用前のチェック

- 屋根・窓枠・家具が途中で曲がったり、増えたりしていないか。
- 明るさがちらつかないか。ループの境目が目立たないか。
- 白い見出しを載せる左側が、十分に暗く落ち着いているか。
- 動きが強すぎず、建築そのものを見たくなる映像になっているか。
- 実際の施工事例として扱わず、コンセプト映像と分かる表示を残しているか。

