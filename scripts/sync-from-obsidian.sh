#!/bin/bash
# sync-from-obsidian.sh
# 从 Obsidian vault 同步内容到项目，然后 commit 和 push

set -e

# 配置路径
OBSIDIAN_SOURCE="/Users/laosanzheong/Documents/obsdata/obslocation/Insight 认知&思考/dia-for"
PROJECT_TARGET="/Users/laosanzheong/Documents/codebases/chatweb/content/chats"
PROJECT_ROOT="/Users/laosanzheong/Documents/codebases/chatweb"

echo "== 同步 Obsidian 内容到项目 =="

# 1. 同步文件（只同步 .md 文件，排除图片等）
echo "从 $OBSIDIAN_SOURCE 同步到 $PROJECT_TARGET ..."
rsync -av --delete --include="*.md" --exclude="*" "$OBSIDIAN_SOURCE/" "$PROJECT_TARGET/"

# 2. 检查是否有变更
cd "$PROJECT_ROOT"
if git diff --quiet content/chats/; then
    echo "没有内容变更。"
    exit 0
fi

# 3. 显示变更
echo ""
echo "== 内容变更 =="
git status --short content/chats/

# 4. 询问是否 commit
echo ""
read -p "是否提交并推送？(y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # 生成 commit message
    CHANGED_FILES=$(git diff --name-only content/chats/ | wc -l | tr -d ' ')
    COMMIT_MSG="content: sync ${CHANGED_FILES} files from Obsidian"
    
    git add content/chats/
    git commit -m "$COMMIT_MSG"
    git push
    
    echo ""
    echo "== 完成！=="
else
    echo "已取消。文件已同步但未提交。"
fi
