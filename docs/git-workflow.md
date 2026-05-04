# Git Workflow

Tai lieu nay ghi lai cac command co ban de team tao branch, tao PR, va don local branches sau khi da push/tao PR.

## Kiem Tra Trang Thai Hien Tai

Chay truoc khi checkout, commit, push, hoac xoa branch:

```bash
git status --short --branch
git branch -vv
git remote -v
```

Y nghia:

- `git status --short --branch`: xem dang o branch nao va working tree co file dang sua khong.
- `git branch -vv`: xem local branches, commit hien tai, va upstream remote neu co.
- `git remote -v`: xem repo dang push/fetch toi remote nao.

## Tao Branch Moi

Tu branch nen tang, vi du `develop`:

```bash
git checkout develop
git checkout -b feat/my-feature
```

Y nghia:

- `git checkout develop`: ve branch nen tang.
- `git checkout -b feat/my-feature`: tao branch moi va checkout vao branch do.

## Commit Thay Doi

```bash
git status --short
git add path/to/file.ts
git commit -m "feat: describe the change"
```

Y nghia:

- Luon dung `git status --short` de xem file nao se duoc commit.
- Chi `git add` dung file thuoc feature dang lam.
- Khong stage file cua nguoi khac neu no khong lien quan.

## Push Branch Va Tao PR

```bash
git push -u origin feat/my-feature
gh pr create --base develop --head feat/my-feature --title "feat: describe the change" --body "## Summary
- item 1
- item 2

## Test
- command used to test"
```

Y nghia:

- `git push -u origin feat/my-feature`: push branch local len GitHub va set upstream.
- `gh pr create`: tao Pull Request tu branch feature vao `develop`.
- `--base develop`: branch dich.
- `--head feat/my-feature`: branch source.

Neu khong dung GitHub CLI, co the mo URL GitHub tra ve sau khi push branch.

## Don Local Branches Sau Khi Tao PR

Neu branch da duoc push va PR da tao, co the xoa local branch de workspace gon hon.

```bash
git checkout develop
git branch -d feat/my-feature
```

Y nghia:

- `git checkout develop`: khong the xoa branch dang checkout, nen phai ve branch khac truoc.
- `git branch -d feat/my-feature`: xoa local branch neu Git thay branch da merge an toan.

Neu PR da tao/push remote nhung branch chua merge vao local `develop`, Git co the tu choi `-d`. Khi do co the dung:

```bash
git branch -D feat/my-feature
```

Chi dung `-D` khi da chac chan branch da duoc push len remote hoac PR da ton tai. Lenh nay chi xoa local branch, khong xoa remote branch tren GitHub.

## Don Remote Tracking Branches Da Bi Xoa Tren GitHub

Sau khi PR merge va remote branch da bi xoa tren GitHub:

```bash
git fetch --prune origin
git branch -r
```

Y nghia:

- `git fetch --prune origin`: cap nhat remote refs va xoa cac remote-tracking refs da khong con tren GitHub.
- `git branch -r`: xem danh sach remote-tracking branches con lai.

## Command Da Dung De Don Workspace Nay

Trong lan cleanup nay:

```bash
git status --short --branch
git branch -vv
git checkout develop
git branch -D feat/crawl_ted feat/crawl-srt-script feat/improve-word-preprocessing
```

Ket qua:

- Da checkout ve `develop`.
- Da xoa cac local feature branches:
  - `feat/crawl_ted`
  - `feat/crawl-srt-script`
  - `feat/improve-word-preprocessing`
- Khong xoa remote branches tren GitHub.
